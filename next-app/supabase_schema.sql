-- Enable necessary extensions if not enabled
create extension if not exists "uuid-ossp";

-- Enum for categories
-- Check if type exists to avoid error if re-running
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'page_category') then
        create type public.page_category as enum ('Algemeen', 'Haartransplantatie', 'V6 Hairboost', 'SEO', 'Other');
    end if;
end
$$;

-- The Pages Table
create table if not exists public.pages (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  -- Core Identification
  slug text not null, -- Full path e.g. "nl/contact" or "nl/haartransplantatie"
  language text not null default 'nl', -- 'nl', 'en'
  
  -- SEO & Metadata
  seo_title text, -- Overrides default title
  page_title text, -- H1 or Internal name
  meta_description text,
  
  -- Classification
  category public.page_category default 'Other',
  
  -- content (for purely dynamic pages later)
  content jsonb, 
  
  -- Status & Settings
  status text not null default 'draft', -- 'published', 'draft', 'archived', 'private'
  is_in_sitemap boolean not null default true,
  
  constraint pages_pkey primary key (id),
  constraint pages_slug_key unique (slug)
);

-- RLS Policies
alter table public.pages enable row level security;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Enable read access for all users" on public.pages;
drop policy if exists "Enable write access for admins" on public.pages;

create policy "Enable read access for all users"
on public.pages for select
using (true);

create policy "Enable write access for admins"
on public.pages for all
to authenticated
using ( true ); -- Allow any authenticated user for now (Local Dev)

-- -----------------------------------------------------------------------------
-- PHASE 5: HIERARCHY & GROUPING
-- -----------------------------------------------------------------------------

-- 1. Add Parent/Child Columns
alter table public.pages 
add column if not exists parent_id uuid references public.pages(id),
add column if not exists sort_order integer default 0;

-- 2. Index for faster tree hierarchy queries
create index if not exists idx_pages_parent_id on public.pages(parent_id);
create index if not exists idx_pages_slug on public.pages(slug);

-- 3. AUTO-ORGANIZE MIGRATION
-- This script finds parents based on URL structure (e.g. 'nl/foo/bar' -> parent 'nl/foo')
do $$ 
declare
    page_record record;
    potential_parent_slug text;
    parent_record record;
    parts text[];
begin
    -- Loop through all pages that don't satisfy the condition of being a root or already having a parent
    for page_record in select * from public.pages where parent_id is null loop
        
        -- Split slug into parts (e.g. 'nl/foo/bar' -> ['nl', 'foo', 'bar'])
        parts := string_to_array(page_record.slug, '/');
        
        -- If it has more than 1 part (meaning it might have a parent)
        -- AND it's not just a language root (like 'nl' or 'en' which have length 1)
        if array_length(parts, 1) > 1 then
            
            -- Construct the potential parent slug by removing the last segment
            -- 'nl/foo/bar' -> 'nl/foo'
            -- We use array_to_string on the slice of the array
            -- Note: PostgreSQL arrays are 1-based. 1 to length-1.
            potential_parent_slug := array_to_string(parts[1:array_length(parts, 1)-1], '/');
            
            -- Find if this parent exists
            select id into parent_record from public.pages where slug = potential_parent_slug limit 1;
            
            -- If found, update the current page
            if found then
                update public.pages 
                set parent_id = parent_record.id 
                where id = page_record.id;
                
                raise notice 'Linked % to parent %', page_record.slug, potential_parent_slug;
            end if;
            
        end if;
    end loop;
end $$;

-- -----------------------------------------------------------------------------
-- PHASE 6: SOCIAL MEDIA & GLOBAL SETTINGS
-- -----------------------------------------------------------------------------

-- 1. Add Social Columns to Pages
alter table public.pages 
add column if not exists og_title text,
add column if not exists og_description text,
add column if not exists og_image text;

-- 2. Create Global Settings Table (Singleton)
create table if not exists public.site_settings (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    
    -- Global Defaults
    site_name text not null default 'GlobalHair Institute',
    default_meta_description text not null default 'GlobalHair Institute is de specialist in haartransplantaties en haarverbetering. Ontdek onze V6 Hairboost en professionele behandelingen.',
    default_og_image text not null default 'https://GlobalHair.b-cdn.net/globalhair%20favicon4.png',
    
    constraint site_settings_pkey primary key (id)
);

-- Ensure only one row can exist
create unique index if not exists one_row_only_uidx on public.site_settings((TRUE));

-- 3. RLS for Settings
alter table public.site_settings enable row level security;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Enable read access for all users" on public.site_settings;
drop policy if exists "Enable write access for admins" on public.site_settings;

create policy "Enable read access for all users"
on public.site_settings for select
using (true);

create policy "Enable write access for admins"
on public.site_settings for all
to authenticated
using ( true ); -- Allow any authenticated user for now (Local Dev)

-- 4. Seed Initial Settings (If empty)
insert into public.site_settings (site_name, default_meta_description, default_og_image)
select 'GlobalHair Institute', 
       'GlobalHair Institute is de specialist in haartransplantaties en haarverbetering. Ontdek onze V6 Hairboost en professionele behandelingen.',
       'https://GlobalHair.b-cdn.net/globalhair%20favicon4.png'
where not exists (select 1 from public.site_settings);

