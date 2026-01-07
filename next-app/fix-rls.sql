-- Allow all authenticated users to write to pages (Temporary fix for development)
drop policy if exists "Enable write access for admins" on public.pages;

create policy "Enable write access for authenticated users"
on public.pages for all
to authenticated
using (true);
