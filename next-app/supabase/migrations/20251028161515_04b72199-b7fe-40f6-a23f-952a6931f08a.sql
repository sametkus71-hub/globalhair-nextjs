-- Add customer address fields to booking_intents table
ALTER TABLE public.booking_intents
ADD COLUMN customer_address text,
ADD COLUMN customer_city text,
ADD COLUMN customer_country text DEFAULT 'Nederland';