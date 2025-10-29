import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { zohoApiRequest } from '../_shared/zoho-utils.ts';
import { toZohoDateFormat } from '../_shared/date-helpers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          webhookSecret,
          undefined,
          Stripe.createSubtleCryptoProvider()
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook signature verification failed:', errorMessage);
        return new Response(
          JSON.stringify({ error: 'Webhook signature verification failed' }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      // For development without signature verification
      event = JSON.parse(body);
    }

    console.log('Webhook event received:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingIntentId = session.metadata?.booking_intent_id;

      if (!bookingIntentId) {
        console.error('No booking_intent_id in session metadata');
        return new Response(
          JSON.stringify({ error: 'No booking_intent_id found' }),
          { status: 400, headers: corsHeaders }
        );
      }

      console.log('Processing payment for booking intent:', bookingIntentId);

      // Update booking intent to paid
      const { data: bookingIntent, error: updateError } = await supabase
        .from('booking_intents')
        .update({
          status: 'paid',
          stripe_payment_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingIntentId)
        .select()
        .single();

      if (updateError || !bookingIntent) {
        console.error('Error updating booking intent:', updateError);
        throw updateError;
      }

      console.log('Booking intent updated to paid, creating Zoho booking...');

      // Create Zoho booking
      try {
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

        // Prepare form data for Zoho API (it uses form-data, not JSON)
        const formData = new FormData();
        formData.append('service_id', bookingIntent.zoho_service_id);
        formData.append('staff_id', bookingIntent.zoho_staff_id);
        formData.append('from_time', formattedFromTime);
        formData.append('to_time', formattedToTime);
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

        console.log('Datetime debug:', {
          selected_date: bookingIntent.selected_date,
          selected_time: bookingIntent.selected_time,
          from_time_db: bookingIntent.from_time,
          to_time_db: bookingIntent.to_time,
          from_time_formatted: formattedFromTime,
          to_time_formatted: formattedToTime,
        });

        console.log('Sending to Zoho:', {
          service_id: bookingIntent.zoho_service_id,
          staff_id: bookingIntent.zoho_staff_id,
          from_time: formattedFromTime,
          to_time: formattedToTime,
          timezone: bookingIntent.timezone,
          customer: bookingIntent.customer_name,
        });

        const zohoResponse = await zohoApiRequest<{ response: { returnvalue: { booking_id: string } } }>(
          '/bookings/v1/json/appointment',
          {
            method: 'POST',
            body: formData,
          }
        );

        console.log('Zoho booking created:', zohoResponse.response.returnvalue.booking_id);

        // Update booking intent to confirmed
        await supabase
          .from('booking_intents')
          .update({
            status: 'confirmed',
            zoho_booking_id: zohoResponse.response.returnvalue.booking_id,
            confirmed_at: new Date().toISOString(),
            zoho_response: zohoResponse,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingIntentId);

        console.log('Booking fully confirmed:', bookingIntentId);

        // Invalidate cache
        await supabase
          .from('availability_slots')
          .delete()
          .eq('service_key', bookingIntent.service_type)
          .eq('date', bookingIntent.selected_date);

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
          .eq('id', bookingIntentId);

        // Don't throw - payment was successful, we'll handle Zoho manually if needed
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
