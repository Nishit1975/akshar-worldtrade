import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook to consume the AuthContext state and methods.
 *
 * @returns {{
 *   session: Object|null,
 *   user: Object|null,
 *   isAdmin: boolean,
 *   loading: boolean,
 *   signIn: Function,
 *   signOut: Function,
 *   checkAdminStatus: Function
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
