ALTER TABLE dealers ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;\nUPDATE dealers SET slug = lower(regexp_replace(business_name, '[^a-z0-9]+', '-', 'g')) WHERE slug IS NULL;
