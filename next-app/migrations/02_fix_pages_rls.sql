-- Enable RLS on pages table (if not already enabled)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 1. DROP existing policies to avoid name collisions
DROP POLICY IF EXISTS "Public Read Access" ON pages;
DROP POLICY IF EXISTS "Authenticated Admin Access" ON pages;
DROP POLICY IF EXISTS "Service Role Access" ON pages;

-- 2. RE-CREATE Policies

-- Policy: Allow READ access to everyone (Public content)
CREATE POLICY "Public Read Access" 
ON pages FOR SELECT 
TO anon, authenticated, service_role 
USING (true);

-- Policy: Allow ALL access (Insert/Update/Delete) to Authenticated Users (Admins)
CREATE POLICY "Authenticated Admin Access" 
ON pages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy: Allow ALL access to Service Role (for API scripts)
CREATE POLICY "Service Role Access" 
ON pages FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Grant permissions to roles (just in case)
GRANT ALL ON pages TO authenticated;
GRANT ALL ON pages TO service_role;
