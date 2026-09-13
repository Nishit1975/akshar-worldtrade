import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ProductForm from '../../components/admin/ProductForm'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getAdminProductById } from '../../services/products'

const AdminEditProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadProduct() {
      if (!id) return

      try {
        const { data, error: fetchErr } = await getAdminProductById(id)
        if (!mounted) return

        if (fetchErr) {
          setError(fetchErr.message || 'Failed to load product')
        } else if (!data) {
          setError('Product not found or has been removed')
        } else {
          setProduct(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unexpected error fetching product')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      mounted = false
    }
  }, [id, retryCount])

  return (
    <>
      <Helmet>
        <title>
          {product ? `Edit ${product.name}` : 'Edit Product'} | Admin Portal | Akshar Worldtrade
        </title>
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-1" aria-label="Breadcrumb">
              <Link to="/admin/products" className="hover:text-navy-600 transition-colors">
                Products
              </Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">Edit</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
              {product ? `Edit: ${product.name}` : 'Edit Product'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Update technical specs, packaging details, and media assets in Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            {product?.slug && product?.status === 'published' && (
              <a
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-navy-700 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-2xs transition-colors"
              >
                <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                View Public
              </a>
            )}
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-navy-700 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-2xs transition-colors"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Products List
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" color="navy" label="Loading product data…" />
            <p className="text-sm text-gray-500">Loading product details from database…</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && error && (
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <EmptyState
              icon={
                <svg className="h-14 w-14 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              }
              title="Unable to load product"
              description={error}
              action={
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true)
                      setError(null)
                      setRetryCount((c) => c + 1)
                    }}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Retry
                  </button>
                  <Link
                    to="/admin/products"
                    className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded transition-colors"
                  >
                    Return to Products
                  </Link>
                </div>
              }
            />
          </div>
        )}

        {/* Loaded Product Form */}
        {!loading && !error && product && (
          <ProductForm key={product.id} initialData={product} isEdit={true} />
        )}
      </div>
    </>
  )
}

export default AdminEditProductPage
