-- ==============================================================================
-- AKSHAR WORLDTRADE — PERMISSIONS & TABLE GRANTS
-- Migration: 002_permissions_and_grants.sql
-- Description: Explicitly grants schema usage and table permissions to anon &
--              authenticated roles. Row Level Security (RLS) policies enforce
--              exact access restrictions (e.g. public can only SELECT published
--              products; only verified admin_users can perform CRUD).
-- ==============================================================================

-- 1. Schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Table-level grants (RLS policies govern actual row access)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;

GRANT SELECT ON public.admin_users TO authenticated;
GRANT INSERT, DELETE ON public.admin_users TO authenticated;

-- 3. Sequences (for any serial/uuid generators)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;
