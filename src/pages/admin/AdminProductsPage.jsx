import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import {
  getAdminProducts,
  deleteProduct,
  toggleProductStatus,
  toggleProductFeatured,
} from '../../services/products'
import { fetchCategories } from '../../services/categories'
import { deleteProductFolder } from '../../services/storage'

const AdminProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [retryCount, setRetryCount] = useState(0)

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  // Quick action loading tracking
  const [togglingId, setTogglingId] = useState(null)


  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getAdminProducts(),
          fetchCategories(),
        ])

        if (!mounted) return

        if (productsRes.error) {
          setError(productsRes.error.message || 'Failed to load products list')
        } else {
          const loaded = productsRes.data || []
          const sorted = [...loaded].sort(
            (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          )
          setProducts(sorted)
        }

        if (!categoriesRes.error && categoriesRes.data) {
          setCategories(categoriesRes.data)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unexpected network error loading products')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [retryCount])

  // Filter products client-side for ultra-fast instant UI filtering
  const filteredProducts = useMemo(() => {
    let list = products

    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      list = list.filter(
        (p) =>
          p.category_id === categoryFilter ||
          p.categories?.id === categoryFilter,
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase()
        const slug = (p.slug || '').toLowerCase()
        const catName = (p.categories?.name || '').toLowerCase()
        return name.includes(q) || slug.includes(q) || catName.includes(q)
      })
    }

    return list
  }, [products, statusFilter, categoryFilter, search])

  // Handle Quick Status Toggle
  const handleToggleStatus = async (product) => {
    if (togglingId) return
    setTogglingId(product.id)
    setActionError(null)

    // Validation: before publishing, check if main image exists
    if (product.status === 'draft' && !product.main_image) {
      setActionError(`Cannot publish "${product.name}" without a main image. Please edit the product and add an image first.`)
      setTogglingId(null)
      return
    }

    try {
      const { data, error: toggleErr } = await toggleProductStatus(
        product.id,
        product.status,
      )

      if (toggleErr) {
        setActionError(`Failed to update status: ${toggleErr.message}`)
      } else if (data) {
        // Optimistically update list
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data : p)),
        )
      }
    } catch (err) {
      setActionError(`Error toggling status: ${err.message}`)
    } finally {
      setTogglingId(null)
    }
  }

  // Handle Quick Featured Toggle
  const handleToggleFeatured = async (product) => {
    if (togglingId) return
    setTogglingId(product.id)
    setActionError(null)

    try {
      const { data, error: featErr } = await toggleProductFeatured(
        product.id,
        product.featured,
      )

      if (featErr) {
        setActionError(`Failed to update featured flag: ${featErr.message}`)
      } else if (data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data : p)),
        )
      }
    } catch (err) {
      setActionError(`Error toggling featured: ${err.message}`)
    } finally {
      setTogglingId(null)
    }
  }

  // Handle Product Deletion
  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setDeleting(true)
    setActionError(null)

    try {
      // 1. Delete database record
      const { success, error: delErr } = await deleteProduct(productToDelete.id)
      if (delErr || !success) {
        throw new Error(delErr?.message || 'Failed to delete product from database')
      }

      // 2. Clean up associated storage files (background / fire-and-forget or awaited)
      try {
        await deleteProductFolder(productToDelete.id)
      } catch (storageErr) {
        if (import.meta.env.DEV) {
          console.warn('Storage cleanup warning:', storageErr)
        }
      }

      // 3. Update state & close modal
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setProductToDelete(null)
    } catch (err) {
      setActionError(err.message || 'Error deleting product')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | Admin Portal | Akshar Worldtrade</title>
      </Helmet>

      <div className="space-y-6">

        {/* ── Header Bar ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
              Products Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage product listings, technical export specifications, and live status.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-700 active:bg-navy-800 text-white text-sm font-semibold rounded shadow-sm transition-colors self-start sm:self-auto"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add New Product
          </Link>
        </div>

        {/* ── Action/Alert Banners ───────────────────────────────── */}
        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Filter / Search Toolbar ────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-2xs p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, slug or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-gray-800 placeholder-gray-400 bg-surface/50"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-700"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-52">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-700"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Table & Data Container ─────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">

          {/* Loading State */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" color="navy" label="Loading products…" />
              <p className="text-sm text-gray-500">Retrieving catalog products…</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8">
              <EmptyState
                icon={
                  <svg className="h-14 w-14 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                }
                title="Failed to load products"
                description={error}
                action={
                  <button
                    type="button"
                    onClick={() => setRetryCount((c) => c + 1)}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Retry Loading
                  </button>
                }
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="p-8">
              <EmptyState
                icon={
                  <svg className="h-14 w-14 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                }
                title={products.length === 0 ? 'No products in database' : 'No matching products'}
                description={
                  products.length === 0
                    ? 'Start building your export catalog by adding your first product with specifications and images.'
                    : 'Try clearing your search query or adjusting status / category filters.'
                }
                action={
                  products.length === 0 ? (
                    <Link
                      to="/admin/products/new"
                      className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-semibold rounded transition-colors"
                    >
                      + Add First Product
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('all')
                        setCategoryFilter('all')
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  )
                }
              />
            </div>
          )}

          {/* Loaded Products Table */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[768px]">
                <thead>
                  <tr className="bg-surface/80 border-b border-gray-100 text-3xs sm:text-2xs uppercase tracking-wider font-semibold text-gray-500 select-none">
                    <th className="py-3.5 pl-4 sm:pl-6 pr-3">Product</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">MOQ / Origin</th>
                    <th className="py-3.5 px-3">Featured</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Updated</th>
                    <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredProducts.map((p) => {
                    const isBusy = togglingId === p.id
                    const categoryName = p.categories?.name || 'Uncategorized'
                    const formattedDate = p.updated_at
                      ? new Date(p.updated_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-surface/40 transition-colors group"
                      >
                        {/* 1. Thumbnail & Name */}
                        <td className="py-3.5 pl-4 sm:pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 bg-surface rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center p-1">
                              {p.main_image ? (
                                <img
                                  src={p.main_image}
                                  alt={p.name}
                                  className="max-h-full max-w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <svg
                                  className="h-6 w-6 text-gray-300"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1}
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                to={`/admin/products/${p.id}/edit`}
                                className="font-semibold text-navy-800 hover:text-navy-600 truncate block text-sm"
                                title={p.name}
                              >
                                {p.name}
                              </Link>
                              <span className="text-2xs text-gray-400 font-mono truncate block max-w-xs">
                                /{p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Category */}
                        <td className="py-3.5 px-3">
                          <span className="inline-block text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded">
                            {categoryName}
                          </span>
                        </td>

                        {/* 3. MOQ & Origin */}
                        <td className="py-3.5 px-3 text-xs text-gray-600">
                          <p className="font-medium text-gray-800 truncate max-w-[150px]" title={p.moq || '—'}>
                            {p.moq || '—'}
                          </p>
                          <p className="text-gray-400 text-2xs truncate max-w-[150px]" title={p.origin || '—'}>
                            {p.origin || '—'}
                          </p>
                        </td>

                        {/* 4. Featured Toggle */}
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleFeatured(p)}
                            className={[
                              'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                              p.featured
                                ? 'bg-gold-50 text-gold-700 hover:bg-gold-100'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                            ].join(' ')}
                            title={p.featured ? 'Featured on Home (Click to toggle)' : 'Not featured (Click to feature)'}
                          >
                            <span className={p.featured ? 'text-gold-500' : 'text-gray-300'}>
                              ★
                            </span>
                            {p.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>

                        {/* 5. Status Toggle */}
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(p)}
                            className="cursor-pointer focus:outline-none group/badge"
                            title={`Click to switch to ${p.status === 'published' ? 'Draft' : 'Published'}`}
                          >
                            <Badge
                              variant={p.status === 'published' ? 'published' : 'draft'}
                              className="group-hover/badge:ring-2 group-hover/badge:ring-navy-300 transition-all capitalize"
                            >
                              <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${p.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                              {p.status}
                            </Badge>
                          </button>
                        </td>

                        {/* 6. Updated Date */}
                        <td className="py-3.5 px-3 text-xs text-gray-400">
                          {formattedDate}
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Public Link (if published) */}
                            {p.status === 'published' && (
                              <a
                                href={`/products/${p.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-navy-600 hover:bg-gray-100 rounded transition-colors"
                                title="View public product page"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                              </a>
                            )}

                            {/* Edit */}
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="p-1.5 text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded transition-colors"
                              title="Edit product"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete product"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zm3.59.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count indicator */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-surface/50 text-xs text-gray-500 flex items-center justify-between">
              <span>
                Showing <strong className="text-navy-800">{filteredProducts.length}</strong> of{' '}
                <strong className="text-navy-800">{products.length}</strong> total products
              </span>
              {filteredProducts.length < products.length && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('all')
                    setCategoryFilter('all')
                  }}
                  className="text-navy-600 hover:text-navy-800 underline font-medium"
                >
                  Show all
                </button>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────── */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => {
          if (!deleting) setProductToDelete(null)
        }}
        title="Delete Product"
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={deleting}
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to permanently delete{' '}
            <strong className="text-navy-800 font-semibold">
              &quot;{productToDelete?.name}&quot;
            </strong>
            ?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This action cannot be undone. The product record and its media assets stored in Supabase Storage will be permanently deleted.
          </p>
        </div>
      </Modal>
    </>
  )
}

export default AdminProductsPage
