-- Relax Category Constraint
-- The database has a strict ENUM or CHECK constraint on 'category'.
-- We want to allow dynamic categories like 'Uncategorized' for the sync script.

-- 1. Convert the column to TEXT (this implicitly drops the enum restriction on the column itself)
ALTER TABLE pages ALTER COLUMN category TYPE text;

-- 2. Optional: If there was a specific default value that was an enum, drop it or rest it
ALTER TABLE pages ALTER COLUMN category SET DEFAULT 'Other';
