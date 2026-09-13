import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import {
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../../services/enquiries'
import { getWhatsAppUrl } from '../../config/company'

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Filters & Search
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest'

  // Active Enquiry Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  // Delete Confirmation Modal
  const [enquiryToDelete, setEnquiryToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  // Load enquiries from Supabase
  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const { data, error: fetchErr } = await getAdminEnquiries()
        if (!mounted) return

        if (fetchErr) {
          setError(fetchErr.message || 'Failed to load enquiries')
        } else {
          setEnquiries(data || [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unexpected network error loading enquiries')
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

  // Count unread / new enquiries
  const newEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === 'new').length
  }, [enquiries])

  // Extract unique products from loaded enquiries for filter dropdown
  const uniqueProducts = useMemo(() => {
    const set = new Set()
    enquiries.forEach((e) => {
      if (e.product && e.product.trim()) {
        set.add(e.product.trim())
      }
    })
    return Array.from(set).sort()
  }, [enquiries])

  // Filter and sort enquiries client-side for immediate responsive UI
  const filteredEnquiries = useMemo(() => {
    let list = enquiries

    if (statusFilter !== 'all') {
      list = list.filter((e) => e.status === statusFilter)
    }

    if (productFilter !== 'all') {
      list = list.filter((e) => (e.product || '').trim() === productFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter((e) => {
        const name = (e.name || '').toLowerCase()
        const email = (e.email || '').toLowerCase()
        const company = (e.company_name || '').toLowerCase()
        const country = (e.country || '').toLowerCase()
        const product = (e.product || '').toLowerCase()
        const message = (e.message || '').toLowerCase()
        const phone = (e.phone || '').toLowerCase()
        return (
          name.includes(q) ||
          email.includes(q) ||
          company.includes(q) ||
          country.includes(q) ||
          product.includes(q) ||
          message.includes(q) ||
          phone.includes(q)
        )
      })
    }

    // Sort
    return [...list].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [enquiries, statusFilter, productFilter, search, sortBy])

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            New
          </span>
        )
      case 'read':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Read
          </span>
        )
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            Replied
          </span>
        )
      default:
        return <Badge size="sm">{status}</Badge>
    }
  }

  // Handle status update (New -> Read -> Replied)
  const handleStatusChange = async (enquiryId, newStatus) => {
    setStatusUpdating(true)
    setActionError(null)

    try {
      const { data, error: updateErr } = await updateEnquiryStatus(
        enquiryId,
        newStatus,
      )

      if (updateErr) {
        throw new Error(updateErr.message || 'Failed to update enquiry status')
      }

      if (data) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === enquiryId ? data : item)),
        )
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(data)
        }
      }
    } catch (err) {
      setActionError(err.message || 'Error updating status')
    } finally {
      setStatusUpdating(false)
    }
  }

  // Open detail modal and automatically mark as read if new
  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry)
    if (enquiry.status === 'new') {
      handleStatusChange(enquiry.id, 'read')
    }
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!enquiryToDelete) return
    setDeleting(true)
    setActionError(null)

    try {
      const { success, error: delErr } = await deleteEnquiry(enquiryToDelete.id)
      if (delErr || !success) {
        throw new Error(delErr?.message || 'Failed to delete enquiry from database')
      }

      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id))
      if (selectedEnquiry && selectedEnquiry.id === enquiryToDelete.id) {
        setSelectedEnquiry(null)
      }
      setEnquiryToDelete(null)
    } catch (err) {
      setActionError(err.message || 'Error deleting enquiry')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Buyer Enquiries | Admin Portal | Akshar Worldtrade</title>
      </Helmet>

      <div className="space-y-6">

        {/* ── Header Bar ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
                  Buyer Quotations & Enquiries
                </h1>
                {newEnquiriesCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {newEnquiriesCount} New
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Review international purchase orders, quote requests, and buyer leads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                setError(null)
                setRetryCount((c) => c + 1)
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 rounded shadow-2xs transition-colors"
              title="Refresh enquiries list"
            >
              <svg
                className="h-3.5 w-3.5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh List
            </button>
          </div>
        </div>

        {/* ── Action Alert Banner ────────────────────────────────── */}
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
              placeholder="Search by buyer name, email, company, country, product, message…"
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

          {/* Status Filter Tabs / Select */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-700"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses ({enquiries.length})</option>
              <option value="new">New Only ({newEnquiriesCount})</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {/* Product Filter */}
          {uniqueProducts.length > 0 && (
            <div className="w-full md:w-52">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-700"
                aria-label="Filter by product"
              >
                <option value="all">All Products</option>
                {uniqueProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Order */}
          <div className="w-full md:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-700"
              aria-label="Sort order"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* ── Table & Data Container ─────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">

          {/* Loading State */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" color="navy" label="Loading enquiries…" />
              <p className="text-sm text-gray-500">Retrieving buyer enquiries…</p>
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
                title="Unable to load enquiries"
                description={error}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true)
                      setError(null)
                      setRetryCount((c) => c + 1)
                    }}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Retry Loading
                  </button>
                }
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredEnquiries.length === 0 && (
            <div className="p-8">
              <EmptyState
                icon={
                  <svg className="h-14 w-14 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.25 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                title={enquiries.length === 0 ? 'No enquiries received yet' : 'No matching enquiries'}
                description={
                  enquiries.length === 0
                    ? 'When international buyers submit quotation requests through the public Quote page, they will appear here.'
                    : 'Try clearing your search query or adjusting status / product filters.'
                }
                action={
                  enquiries.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('all')
                        setProductFilter('all')
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  ) : null
                }
              />
            </div>
          )}

          {/* Loaded Enquiries Table */}
          {!loading && !error && filteredEnquiries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[768px]">
                <thead>
                  <tr className="bg-surface/80 border-b border-gray-100 text-3xs sm:text-2xs uppercase tracking-wider font-semibold text-gray-500 select-none">
                    <th className="py-3.5 pl-4 sm:pl-6 pr-3">Buyer & Company</th>
                    <th className="py-3.5 px-3">Contact</th>
                    <th className="py-3.5 px-3">Product / Qty</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Date</th>
                    <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredEnquiries.map((enq) => {
                    const formattedDate = enq.created_at
                      ? new Date(enq.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'

                    const waUrl = getWhatsAppUrl(enq.phone)

                    return (
                      <tr
                        key={enq.id}
                        onClick={() => handleOpenDetail(enq)}
                        className="hover:bg-surface/50 cursor-pointer transition-colors group"
                      >
                        {/* 1. Buyer & Company */}
                        <td className="py-3.5 pl-4 sm:pl-6 pr-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-navy-800 text-sm truncate">
                                {enq.name}
                              </p>
                              {enq.status === 'new' && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" title="New unread enquiry" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {enq.company_name || 'Individual Importer'}
                              {enq.country ? ` • ${enq.country}` : ''}
                            </p>
                          </div>
                        </td>

                        {/* 2. Contact (Email & Phone) */}
                        <td className="py-3.5 px-3">
                          <div className="text-xs space-y-0.5">
                            <p className="text-navy-700 font-medium truncate max-w-xs">
                              {enq.email}
                            </p>
                            {enq.phone && (
                              <p className="text-gray-400 text-2xs truncate">
                                {enq.phone}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* 3. Product & Quantity */}
                        <td className="py-3.5 px-3">
                          <div className="text-xs max-w-xs">
                            <p className="font-medium text-gray-800 truncate" title={enq.product || 'General Inquiry'}>
                              {enq.product || 'General Inquiry'}
                            </p>
                            {enq.quantity && (
                              <p className="text-gray-400 text-2xs truncate">
                                Qty: {enq.quantity}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* 4. Status Badge & Quick Status Selector */}
                        <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {getStatusBadge(enq.status)}
                          </div>
                        </td>

                        {/* 5. Date */}
                        <td className="py-3.5 px-3 text-xs text-gray-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* 6. Actions */}
                        <td
                          className="py-3.5 pl-3 pr-4 sm:pr-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Email direct */}
                            <a
                              href={`mailto:${enq.email}?subject=${encodeURIComponent(`Re: Enquiry for ${enq.product || 'Akshar Worldtrade'}`)}`}
                              className="p-1.5 text-gray-400 hover:text-navy-600 hover:bg-gray-100 rounded transition-colors"
                              title={`Email ${enq.email}`}
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                              </svg>
                            </a>

                            {/* WhatsApp if available */}
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Open WhatsApp chat"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                              </a>
                            )}

                            {/* View details */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(enq)}
                              className="p-1.5 text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded transition-colors"
                              title="View enquiry details"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setEnquiryToDelete(enq)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete enquiry"
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
          {!loading && !error && filteredEnquiries.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-surface/50 text-xs text-gray-500 flex items-center justify-between">
              <span>
                Showing <strong className="text-navy-800">{filteredEnquiries.length}</strong> of{' '}
                <strong className="text-navy-800">{enquiries.length}</strong> total enquiries
              </span>
              {filteredEnquiries.length < enquiries.length && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('all')
                    setProductFilter('all')
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

      {/* ── 1. ENQUIRY DETAIL MODAL ────────────────────────────── */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title="Buyer Enquiry Dossier"
        size="lg"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            {/* Left: Status Workflow Action Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Mark Status:</span>
              <button
                type="button"
                disabled={statusUpdating || selectedEnquiry?.status === 'read'}
                onClick={() => handleStatusChange(selectedEnquiry?.id, 'read')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedEnquiry?.status === 'read'
                    ? 'bg-gray-200 text-gray-700 font-semibold cursor-default'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                ✓ Mark Read
              </button>
              <button
                type="button"
                disabled={statusUpdating || selectedEnquiry?.status === 'replied'}
                onClick={() => handleStatusChange(selectedEnquiry?.id, 'replied')}
                className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                  selectedEnquiry?.status === 'replied'
                    ? 'bg-green-100 border-green-300 text-green-800 font-semibold cursor-default'
                    : 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700'
                }`}
              >
                ✓ Mark Replied
              </button>
              {selectedEnquiry?.status !== 'new' && (
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleStatusChange(selectedEnquiry?.id, 'new')}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  Reset to New
                </button>
              )}
            </div>

            {/* Right: Close & Delete */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEnquiryToDelete(selectedEnquiry)
                }}
                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Delete
              </button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close
              </Button>
            </div>
          </div>
        }
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            {/* Top Bar: Name & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-navy-800">
                  {selectedEnquiry.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedEnquiry.company_name || 'Individual Importer'}
                  {selectedEnquiry.country ? ` • ${selectedEnquiry.country}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedEnquiry.status)}
              </div>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="bg-surface rounded-lg p-3.5 border border-gray-100 flex flex-col justify-between">
                <span className="text-3xs uppercase font-semibold text-gray-400">
                  Email Address
                </span>
                <p className="text-sm font-medium text-navy-800 truncate my-1">
                  {selectedEnquiry.email}
                </p>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(`Quotation from Akshar Worldtrade: ${selectedEnquiry.product || 'Export Enquiry'}`)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-navy-800 underline mt-1"
                >
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                  Send Direct Email
                </a>
              </div>

              {/* Phone / WhatsApp */}
              <div className="bg-surface rounded-lg p-3.5 border border-gray-100 flex flex-col justify-between">
                <span className="text-3xs uppercase font-semibold text-gray-400">
                  Phone / WhatsApp
                </span>
                <p className="text-sm font-medium text-navy-800 my-1">
                  {selectedEnquiry.phone || <span className="text-gray-400 italic">Not provided</span>}
                </p>
                {selectedEnquiry.phone && getWhatsAppUrl(selectedEnquiry.phone) ? (
                  <a
                    href={getWhatsAppUrl(selectedEnquiry.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 underline mt-1"
                  >
                    <svg className="h-3.5 w-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                ) : (
                  <span className="text-3xs text-gray-400 mt-1">Direct WhatsApp unavailable</span>
                )}
              </div>
            </div>

            {/* Product & Quantity details */}
            <div className="bg-surface rounded-lg p-4 border border-gray-100">
              <span className="text-3xs uppercase font-semibold text-gray-400 block mb-1">
                Requested Product & Volume
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy-800">
                  {selectedEnquiry.product || 'General Catalog Inquiry'}
                </p>
                {selectedEnquiry.quantity && (
                  <span className="text-xs font-medium text-navy-700 bg-white px-2.5 py-1 rounded border border-gray-200 shadow-2xs">
                    Volume: {selectedEnquiry.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Full Message */}
            <div>
              <span className="text-xs font-semibold text-navy-800 block mb-2">
                Buyer Message / Order Description:
              </span>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message || 'No additional message provided.'}
              </div>
            </div>

            {/* Automated Email Delivery Audit Status */}
            {(selectedEnquiry.email_notification_sent !== undefined || selectedEnquiry.buyer_ack_sent !== undefined) && (
              <div className="p-3 bg-surface rounded-lg border border-gray-100 text-xs">
                <span className="font-semibold text-navy-800 block mb-1.5">Email Automation Status:</span>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${selectedEnquiry.email_notification_sent ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Admin Alert: <strong>{selectedEnquiry.email_notification_sent ? 'Sent' : 'Pending / Logged'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${selectedEnquiry.buyer_ack_sent ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Buyer Auto-Reply: <strong>{selectedEnquiry.buyer_ack_sent ? 'Sent' : 'Pending / Logged'}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Meta Timestamp */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>
                Received:{' '}
                {selectedEnquiry.created_at
                  ? new Date(selectedEnquiry.created_at).toLocaleString('en-GB', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : '—'}
              </span>
              <span className="font-mono text-3xs text-gray-300">ID: {selectedEnquiry.id}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── 2. DELETE CONFIRMATION MODAL ───────────────────────── */}
      <Modal
        isOpen={!!enquiryToDelete}
        onClose={() => {
          if (!deleting) setEnquiryToDelete(null)
        }}
        title="Delete Enquiry"
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={deleting}
              onClick={() => setEnquiryToDelete(null)}
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
            Are you sure you want to delete the enquiry from{' '}
            <strong className="text-navy-800 font-semibold">
              &quot;{enquiryToDelete?.name}&quot;
            </strong>
            {enquiryToDelete?.company_name ? ` (${enquiryToDelete.company_name})` : ''}?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This enquiry record will be permanently deleted from the database.
          </p>
        </div>
      </Modal>
    </>
  )
}

export default AdminEnquiriesPage
