-- Nuke all existing policies on pages to ensure a clean slate
drop policy if exists "Enable read access for all users" on public.pages;
drop policy if exists "Enable write access for admins" on public.pages;
drop policy if exists "Enable write access for authenticated users" on public.pages;
drop policy if exists "Enable all access for authenticated users" on public.pages;

-- 1. Allow EVERYONE to read (public)
create policy "Public Read Access"
on public.pages for select
using (true);

-- 2. Allow AUTHENTICATED users to do ANYTHING (Insert, Update, Delete)
-- "using" covers DELETE and UPDATE selection
-- "with check" covers INSERT and UPDATE new values
create policy "Authenticated Write Access"
on public.pages for all
to authenticated
using (true)
with check (true);
