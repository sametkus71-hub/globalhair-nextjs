import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';
import { getServiceConfig, getStaffName } from '../_shared/service-config.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
  location: 'online' | 'onsite';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  staffId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceType, location, date, time, staffId } = await req.json() as VerifyRequest;

    if (!serviceType || !location || !date || !time || !staffId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying slot availability:', { serviceType, location, date, time, staffId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get service config with all staff IDs
    const config = getServiceConfig(serviceType, location);
    const serviceKey = `${serviceType}_${location}`;

    console.log('Fetching live availability from Zoho for all staff:', config.staffIds);

    // Format date for Zoho API (DD-MMM-YYYY)
    const dateObj = new Date(date + 'T12:00:00');
    const zohoDate = formatDateForZoho(dateObj);

    // Fetch availability for ALL staff members in parallel
    const staffResults = await Promise.all(
      config.staffIds.map(async (sid) => {
        try {
          const params = new URLSearchParams({
            service_id: config.serviceId,
            staff_id: sid,
            selected_date: zohoDate,
            timezone: Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam',
          });

          console.log(`Fetching availability for staff ${sid} on ${zohoDate}`);

          const response = await zohoApiRequest<{
            response: {
              status: string;
              returnvalue: {
                data?: string[];
              };
            };
          }>(`/bookings/v1/json/availableslots?${params.toString()}`, { method: 'GET' });

          const slots = response.response.returnvalue.data || [];
          console.log(`Staff ${sid}: ${slots.length} slots available`);

          return {
            staffId: sid,
            staffName: getStaffName(sid),
            slots,
            status: 'success' as const,
          };
        } catch (error) {
          console.error(`Error fetching availability for staff ${sid}:`, error);
          return {
            staffId: sid,
            staffName: getStaffName(sid),
            slots: [],
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    console.log('Updating availability_slots in database for successful fetches only...');

    // Update database ONLY for staff members where we got a successful response
    for (const result of staffResults) {
      // Skip updating if there was an error - keep the cached data
      if (result.status === 'error') {
        console.log(`Skipping DB update for staff ${result.staffId} due to API error - keeping cached data`);
        continue;
      }

      const { error: upsertError } = await supabase
        .from('availability_slots')
        .upsert(
          {
            service_key: serviceKey,
            date: date,
            staff_id: result.staffId,
            staff_name: result.staffName,
            time_slots: result.slots,
            last_synced_at: new Date().toISOString(),
            zoho_response_status: result.status,
            error_message: null,
          },
          { onConflict: 'service_key,date,staff_id' }
        );

      if (upsertError) {
        console.error(`Error upserting slots for staff ${result.staffId}:`, upsertError);
      } else {
        console.log(`Updated slots for staff ${result.staffId}: ${result.slots.length} slots`);
      }
    }

    // Check if we got ANY successful responses
    const anySuccess = staffResults.some(r => r.status === 'success');
    
    // If all API calls failed, return optimistic result (assume slot is still available)
    if (!anySuccess) {
      console.log('All Zoho API calls failed - returning optimistic result, keeping cached data');
      return new Response(
        JSON.stringify({ 
          success: true, 
          slotStillAvailable: true, // Optimistic - let the existing cache be used
          refreshedAt: new Date().toISOString(),
          warning: 'Could not verify with Zoho API - using cached data',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the requested slot is still available
    const selectedStaffResult = staffResults.find(r => r.staffId === staffId);
    const availableSlots = selectedStaffResult?.slots ?? [];
    const slotStillAvailable = availableSlots.some((slot: string) => slot === time);

    console.log('Slot verification result:', { 
      staffId, 
      time, 
      slotStillAvailable,
      availableSlots: selectedStaffResult?.slots 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        slotStillAvailable,
        refreshedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-slot-availability:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
