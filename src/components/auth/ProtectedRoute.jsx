import { Navigate, useLocation, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'

/**
 * ProtectedRoute — ensures only authenticated administrators can access admin panel routes.
 *
 * Rules:
 * 1. While auth state is loading → displays centered loading spinner.
 * 2. If unauthenticated → redirects to /admin/login preserving intended path in location state.
 * 3. If authenticated but not verified in public.admin_users → displays unauthorized screen.
 * 4. If verified admin → renders children or <Outlet />.
 */
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 p-4">
        <Spinner size="lg" color="navy" label="Verifying admin credentials…" />
        <p className="text-sm text-gray-500 font-medium">Verifying authorization…</p>
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Logged in but not in public.admin_users → unauthorized
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-red-500 mb-4">
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-navy-800 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your account (<span className="font-medium text-gray-700">{user.email}</span>) is authenticated, but does not have administrator privileges.
          </p>
          <div className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              onClick={signOut}
              fullWidth
            >
              Sign Out
            </Button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm text-gray-600 hover:text-navy-600 transition-colors"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
