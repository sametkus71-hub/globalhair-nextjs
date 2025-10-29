import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { toZohoDateFormat } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('zoho-create-booking function started');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_intent_id } = await req.json();

    if (!booking_intent_id) {
      return errorResponse('booking_intent_id is required', 400, corsHeaders);
    }

    console.log('Creating booking for intent:', booking_intent_id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking intent
    const { data: bookingIntent, error: fetchError } = await supabase
      .from('booking_intents')
      .select('*')
      .eq('id', booking_intent_id)
      .single();

    if (fetchError || !bookingIntent) {
      console.error('Error fetching booking intent:', fetchError);
      return errorResponse('Booking intent not found', 404, corsHeaders);
    }

    // Validate required fields
    if (!bookingIntent.customer_name || !bookingIntent.customer_email) {
      return errorResponse('Customer information is incomplete', 400, corsHeaders);
    }

    console.log('Booking intent data:', {
      service: bookingIntent.service_type,
      staff: bookingIntent.assigned_staff_name,
      date: bookingIntent.selected_date,
      time: bookingIntent.selected_time,
    });

    // Combine selected_date with from_time and to_time to create full datetime
    const selectedDate = new Date(bookingIntent.selected_date);
    const [fromHours, fromMinutes] = bookingIntent.from_time.split(':');
    const [toHours, toMinutes] = bookingIntent.to_time.split(':');

    // Create full datetime objects
    const fromDateTime = new Date(selectedDate);
    fromDateTime.setHours(parseInt(fromHours), parseInt(fromMinutes), 0, 0);

    const toDateTime = new Date(selectedDate);
    toDateTime.setHours(parseInt(toHours), parseInt(toMinutes), 0, 0);

    // Format to Zoho format: dd-MMM-yyyy HH:mm:ss
    const formattedFromTime = toZohoDateFormat(fromDateTime.toISOString());
    const formattedToTime = toZohoDateFormat(toDateTime.toISOString());

    // Prepare Zoho booking request
    const bookingPayload = {
      service_id: bookingIntent.zoho_service_id,
      staff_id: bookingIntent.zoho_staff_id,
      from_time: formattedFromTime,
      to_time: formattedToTime,
      timezone: bookingIntent.timezone,
      customer_details: {
        name: bookingIntent.customer_name,
        email: bookingIntent.customer_email,
        phone_number: bookingIntent.customer_phone,
      },
      additional_fields: bookingIntent.booking_notes ? {
        notes: bookingIntent.booking_notes,
      } : {},
    };

    console.log('Sending booking to Zoho:', JSON.stringify(bookingPayload, null, 2));

    // Call Zoho Bookings API
    const zohoResponse = await zohoApiRequest<any>(
      `${Deno.env.get('ZB_API_BASE')}/json/bookings`,
      {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      }
    );

    console.log('Zoho booking response:', JSON.stringify(zohoResponse, null, 2));

    // Update booking intent with Zoho booking ID and status
    const { error: updateError } = await supabase
      .from('booking_intents')
      .update({
        zoho_booking_id: zohoResponse.data?.booking_id || null,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        zoho_response: zohoResponse,
      })
      .eq('id', booking_intent_id);

    if (updateError) {
      console.error('Error updating booking intent:', updateError);
      // Continue even if update fails - booking was created in Zoho
    }

    // Invalidate availability cache for this service/date
    const serviceKey = `${bookingIntent.service_type}_${bookingIntent.location}`;
    const { error: cacheError } = await supabase
      .from('availability_slots')
      .delete()
      .eq('service_key', serviceKey)
      .eq('date', bookingIntent.selected_date);

    if (cacheError) {
      console.error('Error invalidating cache:', cacheError);
      // Non-critical error, continue
    }

    return successResponse(
      {
        success: true,
        booking_id: zohoResponse.data?.booking_id,
        message: 'Booking created successfully',
      },
      200,
      corsHeaders
    );
  } catch (error) {
    console.error('Error in zoho-create-booking:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
      corsHeaders
    );
  }
});
