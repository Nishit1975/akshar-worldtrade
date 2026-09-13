import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getAdminDashboardStats } from '../../services/products'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        const { data, error: statsErr } = await getAdminDashboardStats()
        if (!mounted) return

        if (statsErr) {
          setError(statsErr.message || 'Failed to load dashboard statistics')
        } else {
          setStats(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unexpected network error loading dashboard')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [retryCount])

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: (
        <svg className="h-5 w-5 text-navy-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      bg: 'bg-navy-50',
      to: '/admin/products',
    },
    {
      label: 'Published (Live)',
      value: stats?.publishedProducts ?? 0,
      icon: (
        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-green-50',
      to: '/admin/products',
    },
    {
      label: 'Draft Products',
      value: stats?.draftProducts ?? 0,
      icon: (
        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      ),
      bg: 'bg-gray-100',
      to: '/admin/products',
    },
    {
      label: 'Featured Products',
      value: stats?.featuredProducts ?? 0,
      icon: (
        <svg className="h-5 w-5 text-gold-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      bg: 'bg-gold-50',
      to: '/admin/products',
    },
    {
      label: 'New Enquiries',
      value: stats?.newEnquiries ?? 0,
      highlight: (stats?.newEnquiries ?? 0) > 0,
      icon: (
        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.25 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      bg: 'bg-blue-50',
      to: '/admin/enquiries',
    },
    {
      label: 'Total Enquiries',
      value: stats?.totalEnquiries ?? 0,
      icon: (
        <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
      bg: 'bg-purple-50',
      to: '/admin/enquiries',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Portal | Akshar Worldtrade</title>
      </Helmet>

      <div className="space-y-6">

        {/* ── Welcome & Header ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
              Overview Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Live statistics, product catalog management, and buyer enquiries for Akshar Worldtrade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
            >
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* ── Error Banner ──────────────────────────────────────── */}
        {!loading && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 text-sm">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                setError(null)
                setRetryCount((c) => c + 1)
              }}
              className="text-xs font-semibold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── 1. Statistics Cards Grid ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className={`bg-white rounded-xl border shadow-2xs p-4 hover:border-navy-200 hover:shadow-xs transition-all flex flex-col justify-between group ${
                card.highlight ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xs sm:text-2xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  {card.label}
                  {card.highlight && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  {card.icon}
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-100 animate-pulse rounded my-1" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
                    {card.value}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* ── 2. Quick Actions Panel ────────────────────────────── */}
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Quick Operations</h2>
            <p className="text-xs text-navy-200 mt-0.5">
              Rapidly manage your B2B export catalog and respond to international buyer quotations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/products/new"
              className="px-3.5 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded transition-colors shadow-2xs"
            >
              + Add Product
            </Link>
            <Link
              to="/admin/products"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition-colors"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/enquiries"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition-colors"
            >
              View Enquiries ({stats?.newEnquiries ?? 0} new)
            </Link>
          </div>
        </div>

        {/* ── 3. Split Sections: Products & Enquiries ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Products */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-navy-800">
                  Recent Products
                </h2>
                <p className="text-xs text-gray-400">
                  Latest catalog items
                </p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-semibold text-navy-600 hover:text-navy-800 transition-colors"
              >
                All Products →
              </Link>
            </div>

            {loading && (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Spinner size="md" color="navy" label="Loading products…" />
              </div>
            )}

            {!loading && (!stats?.recentProducts || stats.recentProducts.length === 0) && (
              <div className="p-6">
                <EmptyState
                  title="No products yet"
                  description="Your product catalog is empty."
                  action={
                    <Link
                      to="/admin/products/new"
                      className="px-3 py-1.5 bg-navy-600 text-white text-xs font-medium rounded"
                    >
                      + Add Product
                    </Link>
                  }
                />
              </div>
            )}

            {!loading && stats?.recentProducts && stats.recentProducts.length > 0 && (
              <div className="divide-y divide-gray-100 text-xs">
                {stats.recentProducts.map((p) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 shrink-0 bg-surface rounded border border-gray-100 overflow-hidden flex items-center justify-center p-1">
                        {p.main_image ? (
                          <img src={p.main_image} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-2xs text-gray-300">📦</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="font-medium text-navy-800 hover:text-navy-600 truncate block"
                        >
                          {p.name}
                        </Link>
                        <p className="text-gray-400 text-2xs truncate">
                          {p.categories?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={p.status === 'published' ? 'published' : 'draft'} size="sm">
                        {p.status}
                      </Badge>
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-navy-600 hover:text-navy-800 font-semibold underline text-2xs"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Buyer Enquiries */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-navy-800">
                  Recent Quotation Requests
                </h2>
                <p className="text-xs text-gray-400">
                  Incoming leads from global buyers
                </p>
              </div>
              <Link
                to="/admin/enquiries"
                className="text-xs font-semibold text-navy-600 hover:text-navy-800 transition-colors"
              >
                All Enquiries →
              </Link>
            </div>

            {loading && (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Spinner size="md" color="navy" label="Loading enquiries…" />
              </div>
            )}

            {!loading && (!stats?.recentEnquiries || stats.recentEnquiries.length === 0) && (
              <div className="p-6">
                <EmptyState
                  title="No enquiries yet"
                  description="When buyers submit quote requests, they will show up here."
                />
              </div>
            )}

            {!loading && stats?.recentEnquiries && stats.recentEnquiries.length > 0 && (
              <div className="divide-y divide-gray-100 text-xs">
                {stats.recentEnquiries.map((enq) => (
                  <div key={enq.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface/50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-navy-800 truncate">
                          {enq.name}
                        </p>
                        {enq.status === 'new' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-400 text-2xs truncate">
                        {enq.company_name || 'Individual'} • {enq.product || 'General Enquiry'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={enq.status === 'replied' ? 'success' : enq.status === 'new' ? 'info' : 'default'}
                        size="sm"
                      >
                        {enq.status}
                      </Badge>
                      <Link
                        to="/admin/enquiries"
                        className="text-navy-600 hover:text-navy-800 font-semibold underline text-2xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </>
  )
}

export default AdminDashboardPage
