// Fetch availability for a specific day (combining multiple staff if applicable)

import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { getServiceConfig } from '../_shared/service-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceType, location, date } = await req.json();

    if (!serviceType || !location || !date) {
      return errorResponse('Missing serviceType, location, or date', 400);
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date format. Use YYYY-MM-DD', 400);
    }

    // Get service configuration
    const config = getServiceConfig(serviceType, location);

    console.log(`Fetching availability for ${date}, service ${config.serviceId}, staff: ${config.staffIds.join(', ')}`);

    // Fetch availability for all staff members for this specific date
    const availabilityPromises = config.staffIds.map(async (staffId) => {
      const endpoint = `/bookings/v1/json/availableslots`;
      const params = new URLSearchParams({
        service_id: config.serviceId,
        staff_id: staffId,
        selected_date: date,
        timezone: Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam',
      });

      try {
        const response = await zohoApiRequest<any>(
          `${endpoint}?${params.toString()}`,
          { method: 'GET' }
        );

        return {
          staffId,
          slots: response.data?.available_slots || [],
        };
      } catch (error) {
        console.error(`Error fetching slots for staff ${staffId}:`, error);
        return {
          staffId,
          slots: [],
        };
      }
    });

    // Wait for all availability requests
    const allStaffSlots = await Promise.all(availabilityPromises);

    // Merge and deduplicate time slots
    const uniqueSlots = new Set<string>();
    for (const { slots } of allStaffSlots) {
      for (const slot of slots) {
        uniqueSlots.add(slot);
      }
    }

    const sortedSlots = Array.from(uniqueSlots).sort();

    return successResponse({
      date,
      available_slots: sortedSlots,
      service: {
        type: serviceType,
        location,
        duration: config.durationMinutes,
      },
    });

  } catch (error) {
    console.error('Error fetching day availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      500
    );
  }
});
