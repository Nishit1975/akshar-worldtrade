import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingWhatsApp from '../common/FloatingWhatsApp'

/**
 * PublicLayout — wraps all public-facing pages.
 *
 * Structure:
 *   <Navbar />                  (fixed top)
 *   <main> <Outlet /> </main>   (page content — padded for navbar height)
 *   <Footer />
 *   <FloatingWhatsApp />        (fixed bottom-right global action)
 */
const PublicLayout = () => {
  const { pathname } = useLocation()

  // Scroll to top on route change (pure DOM operation, zero React state changes)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/*
        pt-16 on mobile, pt-20 on lg — matches navbar height (h-16 / h-20)
        so page content is never hidden behind the fixed navbar.
      */}
      <main id="main-content" className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default PublicLayout
