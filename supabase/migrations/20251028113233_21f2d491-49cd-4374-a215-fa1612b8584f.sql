-- Fix search_path security for booking_intents functions

-- Drop trigger first, then function
DROP TRIGGER IF EXISTS update_booking_intents_updated_at ON public.booking_intents;
DROP FUNCTION IF EXISTS public.update_booking_intents_updated_at();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.update_booking_intents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_booking_intents_updated_at
  BEFORE UPDATE ON public.booking_intents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_booking_intents_updated_at();