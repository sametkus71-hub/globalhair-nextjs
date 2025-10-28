import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';
import { SERVICES, STAFF, getServiceConfig } from '../_shared/service-config.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Service keys to sync (5 total)
const SERVICES_TO_SYNC = [
  'v6_hairboost_online',
  'v6_hairboost_onsite',
  'haartransplantatie_online',
  'haartransplantatie_onsite',
  'ceo_consult', // Combined service for CEO
];

// Get service config with special handling for CEO
function getServiceConfigForSync(serviceKey: string) {
  if (serviceKey === 'ceo_consult') {
    return {
      serviceId: '166653000001229002',
      staffIds: [STAFF.BERKANT.id],
      durationMinutes: 30,
      priceEuros: 500,
    };
  }
  return SERVICES[serviceKey];
}

// Generate next N weekdays (excluding weekends and past dates)
function generateWeekdays(count: number): Date[] {
  const dates: Date[] = [];
  let current = new Date();
  current.setHours(0, 0, 0, 0);
  
  while (dates.length < count) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && current >= new Date(new Date().setHours(0, 0, 0, 0))) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  console.log('🔄 Starting availability sync for all services');

  try {
    const weekdays = generateWeekdays(60); // Next 60 weekdays
    const syncStarted = new Date().toISOString();

    // Sync all services
    for (const serviceKey of SERVICES_TO_SYNC) {
      console.log(`\n📦 Syncing service: ${serviceKey}`);
      
      const logId = crypto.randomUUID();
      let syncError: string | null = null;

      try {
        // Insert sync log
        await supabase.from('sync_logs').insert({
          id: logId,
          service_key: serviceKey,
          sync_started_at: syncStarted,
          status: 'running',
        });

        const config = getServiceConfigForSync(serviceKey);
        const availabilityData: Array<{ date: string; has_availability: boolean }> = [];
        let apiCallsMade = 0;

        // Check each weekday
        for (let i = 0; i < weekdays.length; i++) {
          const date = weekdays[i];
          const formattedDate = formatDateForZoho(date);
          
          // Check availability for all staff in parallel
          const staffChecks = config.staffIds.map(async (staffId) => {
            apiCallsMade++;
            try {
              const response = await zohoApiRequest<any>(
                `/bookings/v1/json/availableslots?service_id=${config.serviceId}&staff_id=${staffId}&selected_date=${formattedDate}&timezone=Europe/Amsterdam`
              );
              
              const slots = response?.response?.returnvalue?.data || [];
              return slots.length > 0;
            } catch (error) {
              console.error(`Error checking staff ${staffId}:`, error);
              return false;
            }
          });

          const results = await Promise.all(staffChecks);
          const hasAvailability = results.some(r => r === true);

          availabilityData.push({
            date: date.toISOString().split('T')[0],
            has_availability: hasAvailability,
          });

          // Rate limiting delay
          if (i < weekdays.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        // Batch upsert to availability_cache
        const cacheRecords = availabilityData.map(d => ({
          service_key: serviceKey,
          date: d.date,
          has_availability: d.has_availability,
          last_synced_at: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase
          .from('availability_cache')
          .upsert(cacheRecords, {
            onConflict: 'service_key,date',
            ignoreDuplicates: false,
          });

        if (upsertError) throw upsertError;

        // Clean up old dates
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('availability_cache')
          .delete()
          .eq('service_key', serviceKey)
          .lt('date', today);

        // Update sync log
        const daysAvailable = availabilityData.filter(d => d.has_availability).length;
        await supabase
          .from('sync_logs')
          .update({
            sync_completed_at: new Date().toISOString(),
            days_checked: weekdays.length,
            days_available: daysAvailable,
            api_calls_made: apiCallsMade,
            status: 'completed',
          })
          .eq('id', logId);

        console.log(`✅ ${serviceKey}: ${daysAvailable}/${weekdays.length} days available (${apiCallsMade} API calls)`);

      } catch (error) {
        syncError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error syncing ${serviceKey}:`, error);
        
        await supabase
          .from('sync_logs')
          .update({
            sync_completed_at: new Date().toISOString(),
            status: 'failed',
            error_message: syncError,
          })
          .eq('id', logId);
      }
    }

    console.log('✅ Sync completed for all services');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Availability sync completed',
        services_synced: SERVICES_TO_SYNC.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Fatal sync error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
