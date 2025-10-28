-- Enable RLS on sync_logs table
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can manage sync logs
CREATE POLICY "Service role can manage sync logs"
  ON sync_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');