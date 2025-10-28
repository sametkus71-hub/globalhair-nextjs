import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';
import { getServiceConfig, getStaffName } from '../_shared/service-config.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const timezone = Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam';
    const weekdaysToCheck = generateWeekdays(60);

    console.log(`Starting availability sync for ${SERVICES_TO_SYNC.length} services, ${weekdaysToCheck.length} days`);

    const syncResults = [];

    for (const serviceKey of SERVICES_TO_SYNC) {
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

              const rawSlots = response.response?.returnvalue?.data || [];
              
              // Filter to only valid time slots (HH:MM format)
              const validSlots = rawSlots.filter((slot: string) => {
                const isValid = isValidTimeSlot(slot);
                if (!isValid) {
                  console.warn(`Invalid slot format rejected: "${slot}" for ${serviceKey}, ${staffName}, ${dateStr}`);
                }
                return isValid;
              });

              totalSlotsImported += validSlots.length;

              // Store granular data in availability_slots
              const { error: slotError } = await supabase
                .from('availability_slots')
                .upsert({
                  service_key: serviceKey,
                  staff_id: staffId,
                  staff_name: staffName,
                  date: dateStr,
                  time_slots: validSlots,
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

        // Now aggregate to availability_cache
        // A day has availability if ANY staff member has slots
        for (const date of weekdaysToCheck) {
          const dateStr = date.toISOString().split('T')[0];

          // Query availability_slots to check if any staff has slots
          const { data: slotsData, error: queryError } = await supabase
            .from('availability_slots')
            .select('time_slots')
            .eq('service_key', serviceKey)
            .eq('date', dateStr)
            .eq('zoho_response_status', 'success');

          if (queryError) {
            console.error(`Failed to query availability_slots for ${serviceKey} ${dateStr}:`, queryError);
            continue;
          }

          // Check if any staff member has slots
          const hasAvailability = slotsData?.some((row: any) => {
            const slots = Array.isArray(row.time_slots) ? row.time_slots : [];
            return slots.length > 0;
          }) || false;

          // Update availability_cache
          const { error: cacheError } = await supabase
            .from('availability_cache')
            .upsert({
              service_key: serviceKey,
              date: dateStr,
              has_availability: hasAvailability,
              last_synced_at: new Date().toISOString(),
            }, {
              onConflict: 'service_key,date'
            });

          if (cacheError) {
            console.error(`Failed to upsert cache for ${serviceKey} ${dateStr}:`, cacheError);
          }
        }

        // Clean up old records
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('availability_slots').delete().eq('service_key', serviceKey).lt('date', today);
        await supabase.from('availability_cache').delete().eq('service_key', serviceKey).lt('date', today);

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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sync completed',
        results: syncResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Sync failed:', error);
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
