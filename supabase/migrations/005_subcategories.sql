-- ==============================================================================
-- AKSHAR WORLDTRADE — SUBCATEGORIES TABLE & PRODUCT LINKING
-- Migration: 005_subcategories.sql
-- Description: Creates the public.subcategories table with category FK,
--              updated_at trigger, indexes, RLS security policies, and adds
--              subcategory_id to products. Seeds initial subcategories for
--              "Spices & Seasonings".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE SUBCATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_subcategories_category_slug UNIQUE (category_id, slug)
);

-- ------------------------------------------------------------------------------
-- 2. ADD SUBCATEGORY_ID COLUMN TO PRODUCTS
-- ------------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 3. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_is_active ON public.subcategories(is_active);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);

-- ------------------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER tr_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. PERMISSIONS & TABLE GRANTS
-- ------------------------------------------------------------------------------
GRANT SELECT ON public.subcategories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subcategories TO authenticated;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Public / Anonymous: Can read only active subcategories (or admins can read all)
DROP POLICY IF EXISTS "Subcategories readable by public or admin" ON public.subcategories;
CREATE POLICY "Subcategories readable by public or admin"
  ON public.subcategories
  FOR SELECT
  TO public
  USING (is_active = true OR public.is_admin());

-- Admins: Full management permissions
DROP POLICY IF EXISTS "Admins can insert subcategories" ON public.subcategories;
CREATE POLICY "Admins can insert subcategories"
  ON public.subcategories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update subcategories" ON public.subcategories;
CREATE POLICY "Admins can update subcategories"
  ON public.subcategories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete subcategories" ON public.subcategories;
CREATE POLICY "Admins can delete subcategories"
  ON public.subcategories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. INITIAL SUBCATEGORIES FOR "SPICES & SEASONINGS"
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_spice_cat_id UUID;
BEGIN
  -- 1. Locate the Spices category
  SELECT id INTO v_spice_cat_id
  FROM public.categories
  WHERE slug IN ('spices-seasonings', 'spices')
     OR name ILIKE '%spice%'
  ORDER BY created_at ASC
  LIMIT 1;

  -- 2. If it does not exist, create 'Spices & Seasonings'
  IF v_spice_cat_id IS NULL THEN
    INSERT INTO public.categories (name, slug, is_active)
    VALUES ('Spices & Seasonings', 'spices-seasonings', true)
    RETURNING id INTO v_spice_cat_id;
  ELSE
    -- Standardise name to 'Spices & Seasonings' if it was just 'Spices'
    UPDATE public.categories
    SET name = 'Spices & Seasonings'
    WHERE id = v_spice_cat_id
      AND name = 'Spices';
  END IF;

  -- 3. Insert initial 4 subcategories for Spices & Seasonings
  INSERT INTO public.subcategories (category_id, name, slug, description, is_active)
  VALUES
    (
      v_spice_cat_id,
      'Ground Spices',
      'ground-spices',
      'High-purity ground spices processed to international export standards.',
      true
    ),
    (
      v_spice_cat_id,
      'Whole Spices',
      'whole-spices',
      'Natural whole spices cleaned, graded, and packed directly from prime origins.',
      true
    ),
    (
      v_spice_cat_id,
      'Seed Spices',
      'seed-spices',
      'Cleaned and sortex-graded aromatic seed spices from western and northern India.',
      true
    ),
    (
      v_spice_cat_id,
      'Blended Spices',
      'blended-spices',
      'Authentic blended spice seasonings and ready-mix formulations for culinary use.',
      true
    )
  ON CONFLICT (category_id, slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;
END;
$$;
