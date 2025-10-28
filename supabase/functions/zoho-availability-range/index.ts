// Fetch availability for next 30 days (combining multiple staff if applicable)

import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { getServiceConfig } from '../_shared/service-config.ts';
import { formatDateForZoho, generateMonthDates } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AvailabilitySlot {
  date: string;
  available_slots: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceType, location, year, month } = await req.json();

    if (!serviceType || !location || year === undefined || month === undefined) {
      return errorResponse('Missing serviceType, location, year, or month', 400, corsHeaders);
    }

    // Get service configuration
    const config = getServiceConfig(serviceType, location);
    const monthDates = generateMonthDates(year, month);

    // Filter to only future weekdays (skip weekends and past days entirely)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekdayDates = monthDates.filter(date => {
      const dayOfWeek = date.getDay();
      return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday or Saturday
    });
    
    console.log(`Checking ${weekdayDates.length} weekdays (excluding weekends and past) for service ${config.serviceId}, staff: ${config.staffIds.join(', ')}, ${year}-${month + 1}`);

    // Fetch availability for all staff members (fully sequential to avoid rate limiting)
    const allAvailability: any[][] = [];
    
    for (const staffId of config.staffIds) {
      const staffAvailability: any[] = [];
      const staffIndex = config.staffIds.indexOf(staffId);
      
      console.log(`Processing staff ${staffIndex + 1}/${config.staffIds.length} (${staffId})`);
      
      // Process each date completely sequentially
      for (let i = 0; i < weekdayDates.length; i++) {
        const date = weekdayDates[i];
        console.log(`  Checking date ${i + 1}/${weekdayDates.length}: ${date.toISOString().split('T')[0]}`);
        
        const endpoint = `/bookings/v1/json/availableslots`;
        const params = new URLSearchParams({
          service_id: config.serviceId,
          staff_id: staffId,
          selected_date: formatDateForZoho(date),
          timezone: Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam',
        });

        try {
          const response = await zohoApiRequest<any>(
            `${endpoint}?${params.toString()}`,
            { method: 'GET' }
          );

          const dateStr = date.toISOString().split('T')[0];
          const hasSlots = (response.response?.returnvalue?.data || []).length > 0;
          
          staffAvailability.push({
            date: dateStr,
            has_availability: hasSlots,
          });
        } catch (error) {
          console.error(`  Error fetching date ${date}:`, error);
          staffAvailability.push({
            date: date.toISOString().split('T')[0],
            has_availability: false,
          });
        }

        // Add 300ms delay after each API call to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      allAvailability.push(staffAvailability);
      console.log(`  Completed staff ${staffIndex + 1}/${config.staffIds.length}`);
      
      // Add 1000ms delay between staff members
      if (staffIndex < config.staffIds.length - 1) {
        console.log(`  Waiting 1s before next staff member...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Merge availability across staff members
    const mergedAvailability = mergeAvailability(allAvailability);

    return successResponse({
      availability: mergedAvailability,
      service: {
        type: serviceType,
        location,
        duration: config.durationMinutes,
      },
    }, 200, corsHeaders);

  } catch (error) {
    console.error('Error fetching availability range:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      500,
      corsHeaders
    );
  }
});

/**
 * Merge availability from multiple staff members
 * Returns only days with actual availability (no extrapolation)
 */
function mergeAvailability(availabilities: any[][]): AvailabilitySlot[] {
  const mergedMap = new Map<string, boolean>();
  
  // Merge all staff availability
  for (const staffAvailability of availabilities) {
    for (const dayCheck of staffAvailability) {
      const hasAvail = mergedMap.get(dayCheck.date) || dayCheck.has_availability;
      mergedMap.set(dayCheck.date, hasAvail);
    }
  }
  
  // Convert to array with actual availability only
  return Array.from(mergedMap.entries())
    .map(([date, hasAvail]) => ({
      date,
      available_slots: hasAvail ? ['check_day'] : [],
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
