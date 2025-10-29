import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const {
      serviceType,
      location,
      bookingSelection,
      customerInfo,
      price,
    } = await req.json();

    console.log('Creating booking intent for:', {
      serviceType,
      location,
      customer: customerInfo.email,
    });

    // Parse date and time
    const [hours, minutes] = bookingSelection.time.split(':').map(Number);
    const appointmentDate = new Date(bookingSelection.date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Format times for Zoho
    const formatZohoTime = (d: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hour = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hour}:${min}:00`;
    };

    const fromTime = formatZohoTime(appointmentDate);
    const toDate = new Date(appointmentDate.getTime() + bookingSelection.durationMinutes * 60000);
    const toTime = formatZohoTime(toDate);

    // Create booking intent with status pending
    const { data: bookingIntent, error: insertError } = await supabase
      .from('booking_intents')
      .insert({
        service_type: serviceType,
        location: location,
        selected_date: bookingSelection.date,
        selected_time: bookingSelection.time,
        zoho_service_id: bookingSelection.serviceId,
        zoho_staff_id: bookingSelection.staffId,
        assigned_staff_name: bookingSelection.staffName,
        duration_minutes: bookingSelection.durationMinutes,
        price_euros: price,
        appointment_datetime_utc: appointmentDate.toISOString(),
        from_time: fromTime,
        to_time: toTime,
        timezone: 'Europe/Amsterdam',
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        customer_country: customerInfo.country,
        booking_notes: customerInfo.notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating booking intent:', insertError);
      throw insertError;
    }

    console.log('Booking intent created:', bookingIntent.id);

    // Get service name for display
    const serviceName = serviceType === 'v6_hairboost' 
      ? 'V6 Hairboost Consult'
      : serviceType === 'haartransplantatie'
      ? 'Haartransplantatie Consult'
      : 'CEO Consultatie';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
              description: `${location === 'online' ? 'Online' : 'Op locatie'} - ${bookingSelection.staffName}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/nl/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/nl/boek?canceled=true`,
      customer_email: customerInfo.email,
      metadata: {
        booking_intent_id: bookingIntent.id,
      },
    });

    console.log('Stripe session created:', session.id);

    // Update booking intent with stripe session id
    await supabase
      .from('booking_intents')
      .update({ stripe_session_id: session.id })
      .eq('id', bookingIntent.id);

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: session.url,
        bookingIntentId: bookingIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in stripe-create-checkout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
