// Fetch availability for a specific day (combining multiple staff if applicable)

import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { getServiceConfig } from '../_shared/service-config.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

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
      return errorResponse('Missing serviceType, location, or date', 400, corsHeaders);
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date format. Use YYYY-MM-DD', 400, corsHeaders);
    }

    // Get service configuration
    const config = getServiceConfig(serviceType, location);
    
    // Convert YYYY-MM-DD to DD-MMM-YYYY format for Zoho API
    const zohoDate = formatDateForZoho(new Date(date));

    console.log(`Fetching availability for ${date} (${zohoDate}), service ${config.serviceId}, staff: ${config.staffIds.join(', ')}`);

    // Fetch availability for all staff members for this specific date
    const availabilityPromises = config.staffIds.map(async (staffId) => {
      const endpoint = `/bookings/v1/json/availableslots`;
      const params = new URLSearchParams({
        service_id: config.serviceId,
        staff_id: staffId,
        selected_date: zohoDate,
        timezone: Deno.env.get('ZB_TIMEZONE') || 'Europe/Amsterdam',
      });

      try {
        const response = await zohoApiRequest<any>(
          `${endpoint}?${params.toString()}`,
          { method: 'GET' }
        );

        return {
          staffId,
          slots: response.response?.returnvalue?.data || [],
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
    const validTimePattern = /^\d{2}:\d{2}$/;
    
    for (const { slots } of allStaffSlots) {
      for (const slot of slots) {
        // Only add valid time slots (HH:MM format)
        if (validTimePattern.test(slot)) {
          uniqueSlots.add(slot);
        } else {
          console.warn(`Invalid slot format rejected: "${slot}"`);
        }
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
    }, 200, corsHeaders);

  } catch (error) {
    console.error('Error fetching day availability:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch availability',
      500,
      corsHeaders
    );
  }
});
