import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../../assets/logo 2.png'
import { company } from '../../config/company'
import { useQuoteModal } from '../../context/QuoteModalContext'

const navLinks = [
  { label: 'Home',           to: '/',               end: true  },
  { label: 'About Us',       to: '/about',           end: false },
  { label: 'Products',       to: '/products',        end: false },
  { label: 'Why Us',         to: '/why-us',          end: false },
  { label: 'Certifications', to: '/certifications',  end: false },
  { label: 'Contact Us',     to: '/contact',         end: false },
]

const Navbar = () => {
  const { openQuoteModal } = useQuoteModal()
  const [isScrolled,    setIsScrolled]    = useState(false)
  const [isMobileOpen,  setIsMobileOpen]  = useState(false)

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsMobileOpen(false)
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const closeMobile = () => setIsMobileOpen(false)

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200',
        isScrolled ? 'shadow-md' : 'border-b border-gray-100',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex-shrink-0 flex items-center py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded"
            aria-label="AKSHAR WORLDTRADE — Home"
          >
            <img
              src={logo}
              alt={company.name}
              width="2172"
              height="724"
              decoding="async"
              fetchPriority="high"
              className="h-[42px] sm:h-12 lg:h-[78px] xl:h-[80px] w-auto max-w-[190px] sm:max-w-[260px] lg:max-w-[360px] object-contain"
            />
          </Link>

          {/* ── Desktop Navigation ────────────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Primary navigation"
          >
            {navLinks.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'px-4 py-2 text-sm font-medium rounded transition-colors duration-150',
                    isActive
                      ? 'text-navy-600 bg-navy-50'
                      : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => openQuoteModal()}
              className="inline-flex items-center px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-medium rounded transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2 cursor-pointer"
            >
              Get a Quote
            </button>
          </div>

          {/* ── Mobile Hamburger ──────────────────────────────────── */}
          <button
            type="button"
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-lg text-gray-600 hover:text-navy-700 hover:bg-gray-50 flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600"
          >
            {isMobileOpen ? (
              /* Close icon */
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto shadow-lg"
        >
          <nav
            className="flex flex-col py-2"
            aria-label="Mobile navigation"
          >
            {navLinks.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMobile}
                className={({ isActive }) =>
                  [
                    'px-6 py-3.5 text-sm font-medium transition-colors duration-150 border-l-2',
                    isActive
                      ? 'text-navy-600 bg-navy-50 border-navy-600'
                      : 'text-gray-700 border-transparent hover:text-navy-700 hover:bg-gray-50',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile CTA */}
            <div className="px-4 pt-3 pb-4 mt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  openQuoteModal()
                }}
                className="flex items-center justify-center w-full px-5 py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-medium rounded transition-colors duration-150 cursor-pointer"
              >
                Get a Quote
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
