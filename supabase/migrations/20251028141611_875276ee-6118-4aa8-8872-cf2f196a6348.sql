-- Drop the availability_cache table since we no longer use it
DROP TABLE IF EXISTS availability_cache CASCADE;

-- Enable pg_cron and pg_net extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule zoho-sync-availability to run every 4 hours
SELECT cron.schedule(
  'sync-zoho-availability-every-4-hours',
  '0 */4 * * *', -- At minute 0 past every 4th hour
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);