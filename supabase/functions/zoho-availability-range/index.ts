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
      return errorResponse('Missing serviceType, location, year, or month', 400);
    }

    // Get service configuration
    const config = getServiceConfig(serviceType, location);
    const monthDates = generateMonthDates(year, month);

    console.log(`Fetching availability for service ${config.serviceId}, staff: ${config.staffIds.join(', ')}, ${year}-${month + 1}`);

    // Fetch availability for all staff members
    const availabilityPromises = config.staffIds.map(async (staffId) => {
      const staffAvailability: any[] = [];
      
      // Process dates in batches of 5 with 200ms delay
      const batchSize = 5;
      for (let i = 0; i < monthDates.length; i += batchSize) {
        const batch = monthDates.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (date) => {
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
            return {
              date: dateStr,
              available_slots: response.data?.available_slots || [],
            };
          } catch (error) {
            console.error(`Error fetching date ${date}:`, error);
            return {
              date: date.toISOString().split('T')[0],
              available_slots: [],
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        staffAvailability.push(...batchResults);

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < monthDates.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      return staffAvailability;
    });

    // Wait for all staff availability
    const allAvailability = await Promise.all(availabilityPromises);

    // Merge availability across staff members
    const mergedAvailability = mergeAvailability(allAvailability);

    return successResponse({
      availability: mergedAvailability,
      service: {
        type: serviceType,
        location,
        duration: config.durationMinutes,
      },
    });

  } catch (error) {
    console.error('Error fetching availability range:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      500
    );
  }
});

/**
 * Merge availability from multiple staff members
 * Combines slots from all staff for the same date
 */
function mergeAvailability(availabilities: any[][]): AvailabilitySlot[] {
  const dateMap = new Map<string, Set<string>>();

  // Collect all slots by date
  for (const staffAvailability of availabilities) {
    for (const daySlot of staffAvailability) {
      const date = daySlot.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, new Set());
      }
      
      // Add all time slots for this date
      const slots = daySlot.available_slots || [];
      for (const slot of slots) {
        dateMap.get(date)!.add(slot);
      }
    }
  }

  // Convert to array and sort
  const merged: AvailabilitySlot[] = Array.from(dateMap.entries())
    .map(([date, slots]) => ({
      date,
      available_slots: Array.from(slots).sort(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return merged;
}
