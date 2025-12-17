-- Update cron job to call sync function 5 times (once per service)
-- First, unschedule the existing job
SELECT cron.unschedule('sync-zoho-availability-every-4-hours');

-- Schedule 5 separate jobs, one for each service
-- All run at the same time (minute 0 of every 4th hour)
SELECT cron.schedule(
  'sync-zoho-v6-hairboost-online',
  '0 */4 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{"service_key": "v6_hairboost_online"}'::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'sync-zoho-v6-hairboost-onsite',
  '1 */4 * * *', -- 1 minute offset
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{"service_key": "v6_hairboost_onsite"}'::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'sync-zoho-haartransplantatie-online',
  '2 */4 * * *', -- 2 minute offset
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{"service_key": "haartransplantatie_online"}'::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'sync-zoho-haartransplantatie-onsite',
  '3 */4 * * *', -- 3 minute offset
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{"service_key": "haartransplantatie_onsite"}'::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'sync-zoho-ceo-consult-online',
  '4 */4 * * *', -- 4 minute offset
  $$
  SELECT
    net.http_post(
        url:='https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
        body:='{"service_key": "ceo_consult_online"}'::jsonb
    ) as request_id;
  $$
);