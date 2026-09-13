import { supabase } from './supabase'

/**
 * Sign in admin user using email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function signInAdmin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Sign in error:', error.message)
      }
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected sign in exception:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Sign out the currently authenticated user.
 *
 * @returns {Promise<{ error: Error|null }>}
 */
export async function signOutAdmin() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error && import.meta.env.DEV) {
      console.error('Sign out error:', error.message)
    }
    return { error: error || null }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Get current session from Supabase.
 *
 * @returns {Promise<{ session: Object|null, error: Error|null }>}
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    return { session: data?.session || null, error }
  } catch (err) {
    return { session: null, error: err }
  }
}

export const getSession = getCurrentSession

/**
 * Get the currently authenticated user object.
 *
 * @returns {Promise<{ user: Object|null, error: Error|null }>}
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    return { user: data?.user || null, error }
  } catch (err) {
    return { user: null, error: err }
  }
}

/**
 * Check if the given user UUID exists in the public.admin_users authorization table.
 *
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
  if (!userId) return false

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error verifying admin status:', error.message)
      }
      return false
    }

    return !!data && data.id === userId
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Exception verifying admin status:', err)
    }
    return false
  }
}

export const checkIsAdmin = isAdmin
