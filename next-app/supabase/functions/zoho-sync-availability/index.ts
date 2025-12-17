import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';
import { getServiceConfig, getStaffName } from '../_shared/service-config.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Declare EdgeRuntime for background tasks
declare const EdgeRuntime: {
  waitUntil(promise: Promise<any>): void;
};

// Services to sync
const SERVICES_TO_SYNC = [
  'v6_hairboost_online',
  'v6_hairboost_onsite', 
  'haartransplantatie_online',
  'haartransplantatie_onsite',
  'ceo_consult_online',
];

// Helper to get config for sync
function getServiceConfigForSync(serviceKey: string) {
  const parts = serviceKey.split('_');
  const location = parts[parts.length - 1] as 'online' | 'onsite';
  
  if (serviceKey.startsWith('ceo_consult')) {
    return getServiceConfig('ceo_consult', location);
  }
  
  if (serviceKey.startsWith('haartransplantatie')) {
    return getServiceConfig('haartransplantatie', location);
  }
  
  if (serviceKey.startsWith('v6_hairboost')) {
    return getServiceConfig('v6_hairboost', location);
  }
  
  throw new Error(`Unknown service key: ${serviceKey}`);
}

// Generate next N weekdays
function generateWeekdays(count: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(today);
  
  while (dates.length < count) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// Validate time slot format (HH:MM)
function isValidTimeSlot(slot: string): boolean {
  return /^\d{2}:\d{2}$/.test(slot);
}

// Retry wrapper with exponential backoff
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 1,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed: ${lastError.message}`);
      
      if (attempt < maxRetries) {
        const backoffDelay = delayMs * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get service_key from request body (if provided)
    let requestBody: { service_key?: string } = {};
    try {
      requestBody = await req.json();
    } catch {
      // No body provided, will sync all services
    }

    const timezone = Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam';
    const weekdaysToCheck = generateWeekdays(60);

    // Determine which services to sync
    const servicesToSync = requestBody.service_key 
      ? [requestBody.service_key]
      : SERVICES_TO_SYNC;

    console.log(`Starting availability sync for ${servicesToSync.length} service(s), ${weekdaysToCheck.length} days`);

    // Background task that performs the actual sync
    const performSync = async () => {
      const syncResults = [];

      for (const serviceKey of servicesToSync) {
        console.log(`\n--- Syncing ${serviceKey} ---`);
        
        try {
          const config = getServiceConfigForSync(serviceKey);
          
          const { data: logEntry, error: logError } = await supabase
            .from('sync_logs')
            .insert({
              service_key: serviceKey,
              status: 'running',
            })
            .select()
            .single();

          if (logError) {
            console.error(`Failed to create sync log for ${serviceKey}:`, logError);
            continue;
          }

          let totalSlotsImported = 0;
          let apiCallsMade = 0;
          let apiErrorsCount = 0;
          let rateLimitErrorsCount = 0;

          // Process each date
          for (const date of weekdaysToCheck) {
            const zohoDate = formatDateForZoho(date);
            const dateStr = date.toISOString().split('T')[0];

            // Process each staff member
            for (const staffId of config.staffIds) {
              const staffName = getStaffName(staffId);
              
              try {
                const result = await fetchWithRetry(async () => {
                  const endpoint = '/bookings/v1/json/availableslots';
                  const params = new URLSearchParams({
                    service_id: config.serviceId,
                    staff_id: staffId,
                    selected_date: zohoDate,
                    timezone,
                  });

                  apiCallsMade++;
                  const response = await zohoApiRequest<any>(
                    `${endpoint}?${params.toString()}`,
                    { method: 'GET' }
                  );

                  const rawSlots = response.response?.returnvalue?.data;
                  
                  // Ensure rawSlots is an array before filtering
                  const slotsArray = Array.isArray(rawSlots) ? rawSlots : [];
                  
                  // Filter to only valid time slots (HH:MM format)
                  const validSlots = slotsArray.filter((slot: string) => {
                    const isValid = isValidTimeSlot(slot);
                    if (!isValid) {
                      console.warn(`Invalid slot format rejected: "${slot}" for ${serviceKey}, ${staffName}, ${dateStr}`);
                    }
                    return isValid;
                  });

                  return { validSlots, response };
                }, 1, 1000);

                totalSlotsImported += result.validSlots.length;

                // Store granular data in availability_slots
                const { error: slotError } = await supabase
                  .from('availability_slots')
                  .upsert({
                    service_key: serviceKey,
                    staff_id: staffId,
                    staff_name: staffName,
                    date: dateStr,
                    time_slots: result.validSlots,
                    zoho_response_status: 'success',
                    error_message: null,
                    last_synced_at: new Date().toISOString(),
                  }, {
                    onConflict: 'service_key,staff_id,date'
                  });

                if (slotError) {
                  console.error(`Failed to upsert availability_slots for ${serviceKey}, ${staffName}, ${dateStr}:`, slotError);
                }

                // Delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Error fetching slots for ${serviceKey}, ${staffName}, ${dateStr}:`, errorMessage);
                
                if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
                  rateLimitErrorsCount++;
                } else {
                  apiErrorsCount++;
                }

                // Store error in availability_slots
                await supabase
                  .from('availability_slots')
                  .upsert({
                    service_key: serviceKey,
                    staff_id: staffId,
                    staff_name: getStaffName(staffId),
                    date: dateStr,
                    time_slots: [],
                    zoho_response_status: 'error',
                    error_message: errorMessage,
                    last_synced_at: new Date().toISOString(),
                  }, {
                    onConflict: 'service_key,staff_id,date'
                  });
              }
            }
          }

          // Clean up old records
          const today = new Date().toISOString().split('T')[0];
          await supabase.from('availability_slots').delete().eq('service_key', serviceKey).lt('date', today);

          // Update sync log with success
          await supabase
            .from('sync_logs')
            .update({
              status: 'completed',
              sync_completed_at: new Date().toISOString(),
              days_checked: weekdaysToCheck.length,
              api_calls_made: apiCallsMade,
              total_slots_fetched: totalSlotsImported,
              api_errors_count: apiErrorsCount,
              rate_limit_errors_count: rateLimitErrorsCount,
            })
            .eq('id', logEntry.id);

          syncResults.push({
            service: serviceKey,
            success: true,
            totalSlotsImported,
            apiCallsMade,
            apiErrorsCount,
            rateLimitErrorsCount,
          });

          console.log(`✓ ${serviceKey}: ${totalSlotsImported} slots imported (${apiCallsMade} API calls, ${apiErrorsCount} errors, ${rateLimitErrorsCount} rate limits)`);

        } catch (error) {
          console.error(`Failed to sync ${serviceKey}:`, error);
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Try to update sync log with failure
          try {
            await supabase
              .from('sync_logs')
              .update({
                status: 'failed',
                sync_completed_at: new Date().toISOString(),
                error_message: errorMessage,
              })
              .eq('service_key', serviceKey)
              .eq('status', 'running');
          } catch (updateError) {
            console.error(`Failed to update sync log:`, updateError);
          }
          
          syncResults.push({
            service: serviceKey,
            success: false,
            error: errorMessage,
          });
        }
      }

      console.log(`\n✓ Background sync completed for ${servicesToSync.length} service(s)`);
      return syncResults;
    };

    // Start background task with EdgeRuntime.waitUntil (prevents shutdown)
    EdgeRuntime.waitUntil(performSync());

    // Return immediate response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sync started in background',
        services: servicesToSync,
        estimatedDuration: servicesToSync.length === 1 ? '~60 seconds' : '~5 minutes',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 202, // 202 Accepted - processing in background
      }
    );

  } catch (error) {
    console.error('Failed to start sync:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
