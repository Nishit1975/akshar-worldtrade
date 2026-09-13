import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : ''
const supabaseKey = typeof rawKey === 'string' ? rawKey.trim() : ''

/**
 * Supabase client instance using ONLY the public publishable / anon key.
 *
 * IMPORTANT SECURITY RULES:
 * 1. Never import or use the Supabase `service_role` key in frontend code.
 * 2. All authorization is handled via Supabase Auth + PostgreSQL Row Level Security (RLS).
 */
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key')

export default supabase
