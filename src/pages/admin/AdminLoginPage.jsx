import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import logo from '../../assets/logo.png'

const AdminLoginPage = () => {
  const { user, isAdmin, signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Determine where to redirect after login
  const fromPath = location.state?.from?.pathname || '/admin/dashboard'

  // If already logged in and verified as admin, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate(fromPath, { replace: true })
    }
  }, [user, isAdmin, authLoading, navigate, fromPath])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setSubmitting(true)

    try {
      const result = await signIn(email, password)
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials or unauthorized account.')
      } else {
        navigate(fromPath, { replace: true })
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | AKSHAR WORLDTRADE</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">

          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded">
              <img
                src={logo}
                alt="AKSHAR WORLDTRADE"
                className="w-full h-auto max-h-12 max-w-[190px] mx-auto object-contain"
              />
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-navy-800 tracking-tight">
              Admin Portal
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in with your administrative credentials to manage products and enquiries.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2.5"
                >
                  <svg
                    className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Email */}
              <Input
                id="admin-email"
                type="email"
                label="Email Address"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                autoComplete="email"
                autoFocus
              />

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-xs text-navy-600 hover:text-navy-800 font-medium transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    autoComplete="current-password"
                    className="block w-full rounded border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  fullWidth
                >
                  {submitting ? 'Authenticating…' : 'Sign In to Dashboard'}
                </Button>
              </div>
            </form>
          </div>

          {/* Back to website link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            <Link
              to="/"
              className="font-medium text-navy-600 hover:text-navy-800 transition-colors"
            >
              ← Back to main website
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default AdminLoginPage
