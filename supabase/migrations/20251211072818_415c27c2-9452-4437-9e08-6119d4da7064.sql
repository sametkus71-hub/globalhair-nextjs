-- Add separate first name and last name columns to booking_intents
ALTER TABLE public.booking_intents
ADD COLUMN customer_first_name text,
ADD COLUMN customer_last_name text;