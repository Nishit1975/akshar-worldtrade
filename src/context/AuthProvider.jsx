import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { supabase } from '../services/supabase'
import { signInAdmin, signOutAdmin, isAdmin as verifyIsAdmin } from '../services/auth'

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession()
        const currentSession = data?.session || null

        if (!isMounted) return

        if (currentSession?.user) {
          const adminStatus = await verifyIsAdmin(currentSession.user.id)
          if (isMounted) {
            setSession(currentSession)
            setUser(currentSession.user)
            setIsAdmin(adminStatus)
            setLoading(false)
          }
        } else {
          setSession(null)
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error initializing auth session:', err)
        }
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return

      if (newSession?.user) {
        const adminStatus = await verifyIsAdmin(newSession.user.id)
        if (isMounted) {
          setSession(newSession)
          setUser(newSession.user)
          setIsAdmin(adminStatus)
          setLoading(false)
        }
      } else {
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await signInAdmin(email, password)
    if (error) {
      return { success: false, error: error.message || 'Invalid credentials' }
    }

    const authUser = data?.user || null
    if (authUser) {
      const adminVerified = await verifyIsAdmin(authUser.id)
      if (!adminVerified) {
        // User is authenticated in Supabase, but not present in public.admin_users
        await signOutAdmin()
        return {
          success: false,
          error: 'Unauthorized. This account does not have administrator privileges.',
        }
      }
      return { success: true, user: authUser }
    }

    return { success: false, error: 'Sign in failed. Please check your credentials.' }
  }

  const signOut = async () => {
    const { error } = await signOutAdmin()
    setSession(null)
    setUser(null)
    setIsAdmin(false)
    return { error }
  }

  const value = {
    session,
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
    checkAdminStatus: verifyIsAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
