-- Create table for storing Zoho OAuth tokens
CREATE TABLE IF NOT EXISTS public.zoho_tokens (
  id TEXT PRIMARY KEY DEFAULT 'zoho_oauth',
  access_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.zoho_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access tokens (edge functions)
CREATE POLICY "Service role can manage zoho tokens"
  ON public.zoho_tokens
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert initial row (will be updated by edge function)
INSERT INTO public.zoho_tokens (id, access_token, expires_at)
VALUES ('zoho_oauth', 'initial', now())
ON CONFLICT (id) DO NOTHING;