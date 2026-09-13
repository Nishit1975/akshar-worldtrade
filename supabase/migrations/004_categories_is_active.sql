-- ==============================================================================
-- AKSHAR WORLDTRADE � CATEGORIES TABLE ENHANCEMENTS
-- Migration: 004_categories_is_active.sql
-- Description: Adds is_active, description, and updated_at columns to the
--              categories table. Updates the RLS SELECT policy so that public/
--              anonymous users can only read active categories, while admins
--              retain full visibility of all categories.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADD MISSING COLUMNS
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS is_active   BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT now();

      -- Backfill: Ensure any pre-existing rows have is_active set to true
      UPDATE public.categories SET is_active = true WHERE is_active IS NULL;

      -- ------------------------------------------------------------------------------
      -- 2. UPDATED_AT TRIGGER FOR CATEGORIES
      -- ------------------------------------------------------------------------------
      -- Re-use the existing handle_updated_at() function defined in migration 001.
      DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
      CREATE TRIGGER tr_categories_updated_at
        BEFORE UPDATE ON public.categories
          FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();

            -- ------------------------------------------------------------------------------
            -- 3. INDEX ON IS_ACTIVE
            -- ------------------------------------------------------------------------------
            CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

            -- ------------------------------------------------------------------------------
            -- 4. UPDATE RLS POLICY � PUBLIC CAN ONLY SEE ACTIVE CATEGORIES
            -- ------------------------------------------------------------------------------
            -- Drop the old blanket-read policy and replace with a policy that:
            --   . Allows everyone (anon + authenticated) to see active categories.
            --   . Allows admin users to see ALL categories regardless of is_active status.
            DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;

            CREATE POLICY "Categories readable by public or admin"
              ON public.categories
                FOR SELECT
                  TO public
                    USING (is_active = true OR public.is_admin());