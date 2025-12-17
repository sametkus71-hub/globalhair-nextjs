-- Create availability_slots table to store granular data per staff member
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  date DATE NOT NULL,
  time_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
  zoho_response_status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_key, staff_id, date)
);

-- Enable RLS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view availability slots
CREATE POLICY "Anyone can view availability slots"
  ON public.availability_slots
  FOR SELECT
  USING (true);

-- Allow service role to manage availability slots
CREATE POLICY "Service role can manage availability slots"
  ON public.availability_slots
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_availability_slots_service_date 
  ON public.availability_slots(service_key, date);

CREATE INDEX IF NOT EXISTS idx_availability_slots_date 
  ON public.availability_slots(date);

-- Add columns to sync_logs for better tracking
ALTER TABLE public.sync_logs 
  ADD COLUMN IF NOT EXISTS total_slots_fetched INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS api_errors_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rate_limit_errors_count INTEGER DEFAULT 0;