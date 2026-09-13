-- ==============================================================================
-- AKSHAR WORLDTRADE — SEED DATA
-- File: supabase/seed.sql
-- Description: Starter categories for initial development and testing.
-- ==============================================================================

-- Safe starter categories matching the product catalog
INSERT INTO public.categories (name, slug)
VALUES
  ('Grains & Cereals', 'grains-cereals'),
  ('Spices',           'spices'),
  ('Pulses',           'pulses'),
  ('Seeds & Oils',     'seeds-oils')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;
