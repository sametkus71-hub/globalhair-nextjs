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

    // Sparse sampling: Check every 3rd day to reduce API calls
    // This gives ~10 samples per month instead of 31
    const sampledDates = monthDates.filter((_, index) => index % 3 === 0);
    
    console.log(`Sparse sampling: Checking ${sampledDates.length} days (every 3rd) for service ${config.serviceId}, staff: ${config.staffIds.join(', ')}, ${year}-${month + 1}`);

    // Fetch availability for all staff members (sequentially to avoid rate limiting)
    const allAvailability: any[][] = [];
    
    for (const staffId of config.staffIds) {
      const staffAvailability: any[] = [];
      
      // Process sampled dates in batches of 3 with 400ms delay
      const batchSize = 3;
      for (let i = 0; i < sampledDates.length; i += batchSize) {
        const batch = sampledDates.slice(i, i + batchSize);
        
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
            const hasSlots = (response.data?.available_slots || []).length > 0;
            
            return {
              date: dateStr,
              has_availability: hasSlots,
            };
          } catch (error) {
            console.error(`Error fetching date ${date}:`, error);
            return {
              date: date.toISOString().split('T')[0],
              has_availability: false,
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        staffAvailability.push(...batchResults);

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < sampledDates.length) {
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

      allAvailability.push(staffAvailability);
      
      // Add delay between staff members
      if (config.staffIds.indexOf(staffId) < config.staffIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    // Merge availability across staff members and extrapolate to all days
    const mergedAvailability = mergeAndExtrapolate(allAvailability, monthDates);

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
 * Merge sampled availability from multiple staff members and extrapolate to all days
 * Returns which days likely have availability based on sparse sampling
 */
function mergeAndExtrapolate(availabilities: any[][], allDates: Date[]): AvailabilitySlot[] {
  const sampledMap = new Map<string, boolean>();

  // Collect sampled dates
  for (const staffAvailability of availabilities) {
    for (const dayCheck of staffAvailability) {
      const date = dayCheck.date;
      const hasAvail = sampledMap.get(date) || dayCheck.has_availability;
      sampledMap.set(date, hasAvail);
    }
  }

  // Extrapolate: Mark days as potentially available based on nearest sampled day
  const result: AvailabilitySlot[] = allDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    
    // If we sampled this day, use actual result
    if (sampledMap.has(dateStr)) {
      return {
        date: dateStr,
        available_slots: sampledMap.get(dateStr) ? ['check_day'] : [], // Placeholder
      };
    }
    
    // Otherwise, check nearby sampled days (within 3 days)
    const nearbyDates = Array.from(sampledMap.entries())
      .filter(([sampledDate]) => {
        const diff = Math.abs(
          new Date(sampledDate).getTime() - date.getTime()
        ) / (1000 * 60 * 60 * 24);
        return diff <= 3;
      });
    
    const hasNearbyAvailability = nearbyDates.some(([_, hasAvail]) => hasAvail);
    
    return {
      date: dateStr,
      available_slots: hasNearbyAvailability ? ['check_day'] : [],
    };
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}
