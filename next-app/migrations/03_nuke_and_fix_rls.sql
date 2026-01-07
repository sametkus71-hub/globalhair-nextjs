-- RLS FIX V3 (FORCE UPDATE)

-- 1. Disable RLS temporarily to clear everything
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;

-- 2. Drop EVERY known policy on this table to ensure a clean slate
DROP POLICY IF EXISTS "Public Read Access" ON pages;
DROP POLICY IF EXISTS "Authenticated Admin Access" ON pages;
DROP POLICY IF EXISTS "Service Role Access" ON pages;
DROP POLICY IF EXISTS "Enable read access for all users" ON pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Allow All Access For Dev" ON pages; -- Drop the previous one

-- 3. Re-enable into a known state
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 4. Create a single SUPER PERMISSIVE policy with a NEW NAME
-- This ensures the system recognizes it as a fresh change.
CREATE POLICY "Dev_Policy_V3_Allow_All"
ON pages
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 5. Explicit grants
GRANT ALL ON pages TO anon;
GRANT ALL ON pages TO authenticated;
GRANT ALL ON pages TO service_role;
