import { useState, useEffect, useCallback } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/logo.png'

/* ── Sidebar navigation items ──────────────────────────────── */
const sidebarNav = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
        <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5.22 1.72a.75.75 0 011.06 0L10 10.94l1.72-1.72a.75.75 0 111.06 1.06L11.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L8.94 12 7.22 10.28a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Add Product',
    to: '/admin/products/new',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
        <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm3.22 1.72a.75.75 0 011.06 0L8 10.94l1.72-1.72a.75.75 0 111.06 1.06L9.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L8 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L6.94 12 5.22 10.28a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Enquiries',
    to: '/admin/enquiries',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
    ),
  },
]

/* ── Page title derivation ──────────────────────────────────── */
const getPageTitle = (pathname) => {
  if (pathname === '/admin/dashboard')         return 'Dashboard'
  if (pathname === '/admin/products/new')      return 'Add Product'
  if (pathname.includes('/admin/products/') && pathname.includes('/edit')) return 'Edit Product'
  if (pathname === '/admin/products')          return 'Products'
  if (pathname === '/admin/categories')        return 'Categories'
  if (pathname === '/admin/enquiries')         return 'Enquiries'
  return 'Admin'
}

/* ── Sidebar Component (shared desktop+mobile) ──────────────── */
const SidebarContent = ({ onClose, userEmail }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className="px-5 py-5 border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded">
        <img src={logo} alt="AKSHAR WORLDTRADE" className="h-8 w-auto max-w-[150px] max-h-9 object-contain" />
      </Link>
      <div className="mt-3">
        <p className="text-xs font-semibold text-navy-800 tracking-wide uppercase">Admin Portal</p>
        {userEmail && (
          <p className="text-xs text-gray-400 truncate mt-0.5" title={userEmail}>
            {userEmail}
          </p>
        )}
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
      <ul className="flex flex-col gap-0.5">
        {sidebarNav.map(({ label, to, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/admin/products' ? false : true}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-navy-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy-700',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>
                    {icon}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    {/* Back to website link */}
    <div className="px-3 py-4 border-t border-gray-100">
      <Link
        to="/"
        className="flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-gray-500 hover:text-navy-600 hover:bg-gray-50 transition-colors"
      >
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to Website
      </Link>
    </div>
  </div>
)

/* ── AdminLayout ────────────────────────────────────────────── */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const pageTitle = getPageTitle(location.pathname)

  // Close sidebar on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setSidebarOpen(false)
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Desktop Sidebar (fixed) ──────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-30"
        aria-label="Admin sidebar"
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} userEmail={user?.email} />
      </aside>

      {/* ── Mobile Sidebar Overlay ──────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <aside
            className="relative w-72 bg-white flex flex-col h-full shadow-xl z-50"
            aria-label="Admin sidebar"
          >
            <div className="flex justify-end p-3 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent onClose={() => setSidebarOpen(false)} userEmail={user?.email} />
          </aside>
        </div>
      )}

      {/* ── Main Content Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">

        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="lg:hidden p-2 rounded text-gray-500 hover:text-navy-700 hover:bg-gray-100 transition-colors shrink-0"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-sm sm:text-base font-semibold text-navy-800 truncate">
                {pageTitle}
              </h1>
            </div>

            {/* Header right — user & logout */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {user?.email && (
                <span className="hidden md:inline text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-100 max-w-xs truncate">
                  {user.email}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-red-600 transition-colors px-2.5 sm:px-3 py-1.5 rounded hover:bg-red-50"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="admin-main-content" className="flex-1 p-3.5 sm:p-6 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
