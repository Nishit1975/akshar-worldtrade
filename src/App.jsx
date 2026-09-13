import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Initial load screen (shows once per session, never on SPA navigation)
import LoadingScreen from './components/ui/LoadingScreen'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

// Protected Route Guard
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import WhyUsPage from './pages/public/WhyUsPage'
import CertificationsPage from './pages/public/CertificationsPage'
import QuotePage from './pages/public/QuotePage'
import ContactPage from './pages/public/ContactPage'
import CataloguePage from './pages/public/CataloguePage'
import NotFoundPage from './pages/public/NotFoundPage'

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminAddProductPage from './pages/admin/AdminAddProductPage'
import AdminEditProductPage from './pages/admin/AdminEditProductPage'
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'

// Global Quote Modal & Context
import { QuoteModalProvider } from './context/QuoteModalContext'
import QuoteModal from './components/modals/QuoteModal'

function App() {
  return (
    <LoadingScreen>
      <BrowserRouter>
        <QuoteModalProvider>
          <QuoteModal />
          <Routes>

          {/* ── Public site — Navbar + Footer ───────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/Contact" element={<Navigate to="/contact" replace />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin login — standalone (public / unauthenticated) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Admin panel — protected sidebar layout ─────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminAddProductPage />} />
            <Route path="products/:id/edit" element={<AdminEditProductPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
          </Route>

        </Routes>
        </QuoteModalProvider>
      </BrowserRouter>
    </LoadingScreen>
  )
}

export default App
