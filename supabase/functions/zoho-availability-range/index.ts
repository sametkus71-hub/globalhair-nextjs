// Fetch availability for next 30 days (combining multiple staff if applicable)

import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { getServiceConfig } from '../_shared/service-config.ts';
import { getAvailabilityDateRange } from '../_shared/date-helpers.ts';

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
    const { serviceType, location } = await req.json();

    if (!serviceType || !location) {
      return errorResponse('Missing serviceType or location', 400);
    }

    // Get service configuration
    const config = getServiceConfig(serviceType, location);
    const dateRange = getAvailabilityDateRange();

    console.log(`Fetching availability for service ${config.serviceId}, staff: ${config.staffIds.join(', ')}`);

    // Fetch availability for all staff members
    const availabilityPromises = config.staffIds.map(async (staffId) => {
      const endpoint = `/bookings/v1/json/availableslots`;
      const params = new URLSearchParams({
        service_id: config.serviceId,
        staff_id: staffId,
        from_date: dateRange.from,
        to_date: dateRange.to,
        timezone: Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam',
      });

      const response = await zohoApiRequest<any>(
        `${endpoint}?${params.toString()}`,
        { method: 'GET' }
      );

      return response.data?.availability || [];
    });

    // Wait for all availability requests
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
