import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stripe_session_id } = await req.json();

    if (!stripe_session_id) {
      return new Response(
        JSON.stringify({ error: 'stripe_session_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing booking for session:', stripe_session_id);

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking intent by stripe_session_id
    const { data: bookingIntent, error: fetchError } = await supabase
      .from('booking_intents')
      .select('*')
      .eq('stripe_session_id', stripe_session_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching booking intent:', fetchError);
      throw fetchError;
    }

    if (!bookingIntent) {
      return new Response(
        JSON.stringify({ error: 'Booking intent not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found booking intent:', bookingIntent.id, 'Status:', bookingIntent.status);

    // If already confirmed, return success (idempotent)
    if (bookingIntent.status === 'confirmed') {
      console.log('Booking already confirmed, returning existing data');
      return new Response(
        JSON.stringify({ success: true, booking: bookingIntent, already_confirmed: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If already paid but not confirmed (Zoho failed), try to create Zoho booking again
    if (bookingIntent.status === 'paid') {
      console.log('Booking is paid, attempting Zoho booking creation...');
      return await createZohoBooking(supabase, bookingIntent);
    }

    // If pending, verify with Stripe first
    if (bookingIntent.status === 'pending') {
      console.log('Booking is pending, verifying with Stripe...');

      // Retrieve the Stripe session to verify payment
      const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
      
      console.log('Stripe session status:', session.status, 'Payment status:', session.payment_status);

      if (session.payment_status !== 'paid') {
        return new Response(
          JSON.stringify({ 
            error: 'Payment not completed', 
            payment_status: session.payment_status,
            booking: bookingIntent 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update to paid
      const { error: updateError } = await supabase
        .from('booking_intents')
        .update({
          status: 'paid',
          stripe_payment_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingIntent.id);

      if (updateError) {
        console.error('Error updating to paid:', updateError);
        throw updateError;
      }

      console.log('Updated booking to paid, creating Zoho booking...');

      // Refresh booking intent with updated status
      const { data: updatedIntent } = await supabase
        .from('booking_intents')
        .select('*')
        .eq('id', bookingIntent.id)
        .single();

      return await createZohoBooking(supabase, updatedIntent!);
    }

    // For any other status (expired, etc.)
    return new Response(
      JSON.stringify({ 
        error: 'Booking cannot be processed', 
        status: bookingIntent.status,
        booking: bookingIntent 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createZohoBooking(supabase: any, bookingIntent: any) {
  try {
    console.log('Creating Zoho booking for:', bookingIntent.id);
    console.log('Zoho booking data:', {
      service_id: bookingIntent.zoho_service_id,
      staff_id: bookingIntent.zoho_staff_id,
      from_time: bookingIntent.from_time,
      to_time: bookingIntent.to_time,
      timezone: bookingIntent.timezone,
      customer: bookingIntent.customer_name,
    });

    // Prepare form data for Zoho API
    const formData = new FormData();
    formData.append('service_id', bookingIntent.zoho_service_id);
    formData.append('staff_id', bookingIntent.zoho_staff_id);
    formData.append('from_time', bookingIntent.from_time);
    formData.append('to_time', bookingIntent.to_time);
    formData.append('timezone', bookingIntent.timezone);
    formData.append('customer_details', JSON.stringify({
      name: bookingIntent.customer_name,
      email: bookingIntent.customer_email,
      phone_number: bookingIntent.customer_phone,
    }));
    formData.append('additional_fields', JSON.stringify({
      address: bookingIntent.customer_address,
      city: bookingIntent.customer_city,
      country: bookingIntent.customer_country,
      ...(bookingIntent.additional_fields || {})
    }));
    if (bookingIntent.booking_notes) {
      formData.append('notes', bookingIntent.booking_notes);
    }

    const zohoResponse = await zohoApiRequest<{ response: { returnvalue: { booking_id: string } } }>(
      '/bookings/v1/json/appointment',
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Zoho booking created:', zohoResponse.response.returnvalue.booking_id);

    // Update booking intent to confirmed
    const { data: confirmedBooking, error: confirmError } = await supabase
      .from('booking_intents')
      .update({
        status: 'confirmed',
        zoho_booking_id: zohoResponse.response.returnvalue.booking_id,
        confirmed_at: new Date().toISOString(),
        zoho_response: zohoResponse,
        updated_at: new Date().toISOString(),
        error_message: null, // Clear any previous error
      })
      .eq('id', bookingIntent.id)
      .select()
      .single();

    if (confirmError) {
      console.error('Error updating to confirmed:', confirmError);
      throw confirmError;
    }

    console.log('Booking fully confirmed:', bookingIntent.id);

    // Invalidate availability cache
    await supabase
      .from('availability_slots')
      .delete()
      .eq('service_key', bookingIntent.service_type)
      .eq('date', bookingIntent.selected_date);

    return new Response(
      JSON.stringify({ success: true, booking: confirmedBooking }),
      { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } }
    );

  } catch (zohoError) {
    console.error('Error creating Zoho booking:', zohoError);
    const errorMessage = zohoError instanceof Error ? zohoError.message : 'Unknown error';

    // Update booking with error but keep as paid
    await supabase
      .from('booking_intents')
      .update({
        error_message: `Zoho booking failed: ${errorMessage}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingIntent.id);

    // Fetch updated booking
    const { data: errorBooking } = await supabase
      .from('booking_intents')
      .select('*')
      .eq('id', bookingIntent.id)
      .single();

    return new Response(
      JSON.stringify({ 
        error: 'Failed to create appointment in system', 
        details: errorMessage,
        booking: errorBooking 
      }),
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } }
    );
  }
}
