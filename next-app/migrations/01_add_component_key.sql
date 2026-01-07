-- Add component_key column to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS component_key TEXT;

-- Create an index for faster lookups since we'll query by this key
CREATE INDEX IF NOT EXISTS idx_pages_component_key ON pages(component_key);

-- Optional: Ensure uniqueness if we want 1-to-1 mapping for certain templates, 
-- but for SEO templates (1-to-many), we might NOT want this unique.
-- For now, let's keep it non-unique to allow reuse of templates (e.g. 'generic-seo-template').

COMMENT ON COLUMN pages.component_key IS 'Stable identifier linking this page record to a React Component in the code registry.';
