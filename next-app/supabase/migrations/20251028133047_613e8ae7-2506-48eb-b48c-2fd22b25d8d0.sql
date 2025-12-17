-- Create availability_cache table
CREATE TABLE availability_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT NOT NULL,
  date DATE NOT NULL,
  has_availability BOOLEAN NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(service_key, date)
);

-- Indexes for fast queries
CREATE INDEX idx_availability_cache_service_date 
  ON availability_cache(service_key, date);

CREATE INDEX idx_availability_cache_date 
  ON availability_cache(date);

CREATE INDEX idx_availability_cache_synced 
  ON availability_cache(last_synced_at);

-- Enable RLS
ALTER TABLE availability_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view availability cache"
  ON availability_cache FOR SELECT
  USING (true);

-- Only service role can manage
CREATE POLICY "Service role can manage availability cache"
  ON availability_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Create sync_logs table for monitoring
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sync_completed_at TIMESTAMPTZ,
  service_key TEXT NOT NULL,
  days_checked INTEGER,
  days_available INTEGER,
  api_calls_made INTEGER,
  status TEXT NOT NULL DEFAULT 'running',
  error_message TEXT,
  
  CONSTRAINT sync_logs_status_check 
    CHECK (status IN ('running', 'completed', 'failed'))
);

CREATE INDEX idx_sync_logs_started 
  ON sync_logs(sync_started_at DESC);

-- Schedule sync job to run every 4 hours
SELECT cron.schedule(
  'sync-zoho-availability',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/zoho-sync-availability',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule daily cleanup of old sync logs
SELECT cron.schedule(
  'cleanup-sync-logs',
  '0 3 * * *',
  $$
  DELETE FROM sync_logs 
  WHERE sync_started_at < now() - interval '7 days';
  $$
);