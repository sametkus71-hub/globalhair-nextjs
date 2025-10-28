-- Create booking_intents table for managing the booking flow
CREATE TABLE IF NOT EXISTS public.booking_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Booking Details
  service_type text NOT NULL CHECK (service_type IN ('v6_hairboost', 'haartransplantatie', 'ceo_consult')),
  location text NOT NULL CHECK (location IN ('online', 'onsite')),
  selected_date date NOT NULL,
  selected_time time NOT NULL,
  appointment_datetime_utc timestamp with time zone NOT NULL,
  from_time text NOT NULL, -- Zoho format: dd-MMM-yyyy HH:mm:ss
  to_time text NOT NULL, -- Zoho format: dd-MMM-yyyy HH:mm:ss
  duration_minutes integer NOT NULL,
  timezone text NOT NULL DEFAULT 'Europe/Amsterdam',
  
  -- Customer Details
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_notes text,
  additional_fields jsonb DEFAULT '{}'::jsonb,
  
  -- Pricing
  price_euros numeric(10, 2) NOT NULL,
  
  -- Zoho Tracking
  zoho_service_id text NOT NULL,
  zoho_staff_id text NOT NULL,
  assigned_staff_name text,
  zoho_booking_id text,
  zoho_response jsonb,
  
  -- Payment Tracking
  stripe_session_id text UNIQUE,
  stripe_payment_id text,
  
  -- Status Management
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'failed', 'cancelled', 'expired')),
  error_message text,
  webhook_sent_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 minutes'),
  confirmed_at timestamp with time zone
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_intents_status ON public.booking_intents(status);
CREATE INDEX IF NOT EXISTS idx_booking_intents_stripe_session ON public.booking_intents(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_booking_intents_created_at ON public.booking_intents(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_intents_expires_at ON public.booking_intents(expires_at) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE public.booking_intents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can insert a booking intent (when they start booking)
CREATE POLICY "Anyone can create booking intents"
  ON public.booking_intents
  FOR INSERT
  WITH CHECK (true);

-- Anyone can view their own booking by id (for success page)
CREATE POLICY "Anyone can view booking intents by id"
  ON public.booking_intents
  FOR SELECT
  USING (true);

-- Only edge functions can update booking intents
CREATE POLICY "Service role can update booking intents"
  ON public.booking_intents
  FOR UPDATE
  USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_booking_intents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_booking_intents_updated_at
  BEFORE UPDATE ON public.booking_intents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_intents_updated_at();

-- Create function to cleanup expired booking intents
CREATE OR REPLACE FUNCTION public.cleanup_expired_booking_intents()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark pending bookings as expired after 30 minutes
  UPDATE public.booking_intents
  SET status = 'expired',
      updated_at = now()
  WHERE status = 'pending'
    AND expires_at < now();
END;
$$;