-- RLS FIX V4 - Explicit DELETE Support

-- 1. Disable RLS
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL policies (including V3)
DROP POLICY IF EXISTS "Public Read Access" ON pages;
DROP POLICY IF EXISTS "Authenticated Admin Access" ON pages;
DROP POLICY IF EXISTS "Service Role Access" ON pages;
DROP POLICY IF EXISTS "Enable read access for all users" ON pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Allow All Access For Dev" ON pages;
DROP POLICY IF EXISTS "Dev_Policy_V3_Allow_All" ON pages;

-- 3. Re-enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 4. Create separate policies for each operation (more explicit)
CREATE POLICY "Dev_Allow_SELECT"
ON pages FOR SELECT
TO public
USING (true);

CREATE POLICY "Dev_Allow_INSERT"
ON pages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Dev_Allow_UPDATE"
ON pages FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Dev_Allow_DELETE"
ON pages FOR DELETE
TO public
USING (true);

-- 5. Explicit grants
GRANT ALL ON pages TO anon;
GRANT ALL ON pages TO authenticated;
GRANT ALL ON pages TO service_role;
