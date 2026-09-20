import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useQuoteModal } from '../../context/QuoteModalContext'
import { getPublishedProducts } from '../../services/products'
import { submitEnquiry } from '../../services/enquiries'

const INITIAL_FORM = {
  fullName: '',
  companyName: '',
  country: '',
  email: '',
  phone: '',
  product: '',
  quantity: '',
  message: '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (data) => {
  const errors = {}
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!data.country.trim()) errors.country = 'Country is required.'
  if (!data.email.trim()) errors.email = 'Email address is required.'
  else if (!emailRegex.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (!data.message.trim()) errors.message = 'Please describe your requirement.'
  return errors
}

/**
 * Inner dialog component, mounted only when modal is open.
 * Resets all state automatically on unmount/remount.
 */
function QuoteDialog({ initialProduct, onClose }) {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    product: initialProduct || '',
  })
  const [productOptions, setProductOptions] = useState(() => {
    const defaultOptions = [
      { value: '', label: 'Select a product (optional)' },
      { value: 'other', label: 'Other / General Inquiry' },
    ]
    if (initialProduct && initialProduct !== 'other') {
      defaultOptions.splice(1, 0, { value: initialProduct, label: initialProduct })
    }
    return defaultOptions
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  const modalRef = useRef(null)

  // Keep formData.product in sync if initialProduct changes
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialProduct)
  if (prevInitialProduct !== initialProduct) {
    setPrevInitialProduct(initialProduct)
    if (initialProduct) {
      setFormData((prev) => ({ ...prev, product: initialProduct }))
    }
  }

  // Fetch published products for dropdown options
  useEffect(() => {
    let isMounted = true
    async function fetchProducts() {
      try {
        const { data } = await getPublishedProducts()
        if (isMounted && data && data.length > 0) {
          const names = data.map((p) => p.name)
          const options = [
            { value: '', label: 'Select a product (optional)' },
            ...data.map((p) => ({ value: p.name, label: p.name })),
          ]
          if (initialProduct && initialProduct !== 'other' && !names.includes(initialProduct)) {
            options.push({ value: initialProduct, label: initialProduct })
          }
          options.push({ value: 'other', label: 'Other / General Inquiry' })
          setProductOptions(options)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load products for quote modal:', err)
        }
      }
    }
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [initialProduct])

  // Lock body scrolling while dialog is mounted & handle Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorField = Object.keys(validationErrors)[0]
      const el = document.getElementById(`modal-${firstErrorField}`)
      if (el) el.focus()
      return
    }

    setLoading(true)
    setSubmitError(null)

    try {
      const { error: submitErr } = await submitEnquiry({
        name: formData.fullName,
        company_name: formData.companyName,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        product: formData.product,
        quantity: formData.quantity,
        message: formData.message,
      })

      if (submitErr) {
        if (import.meta.env.DEV) {
          console.error('Quote modal submission error:', submitErr)
        }
        throw new Error('Unable to submit your quote request at this moment. Please try again or reach out directly.')
      }

      setSubmittedName(formData.fullName)
      setSubmitted(true)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Quote modal submission exception:', err)
      }
      setSubmitError(err.message || 'We could not submit your quotation request. Please try again or contact us via WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden sm:overflow-y-auto bg-navy-950/75 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[660px] h-full sm:h-auto sm:my-auto max-h-full sm:max-h-[92vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-0 sm:border border-navy-100/50 animate-in fade-in duration-200"
      >
        {/* ── Modal Header (Akshar Navy Background) ──────────────── */}
        <div className="sticky top-0 z-10 bg-navy-900 px-4 sm:px-6 py-3.5 sm:py-5 text-white shrink-0 border-b border-navy-800">
          {/* Eyebrow in Akshar Gold */}
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            <span>REQUEST A QUOTE</span>
          </div>

          {/* Title */}
          <h2
            id="quote-modal-title"
            className="text-lg sm:text-2xl font-bold text-white tracking-tight"
          >
            Request an Export Quote
          </h2>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm text-navy-100/80 leading-relaxed mt-0.5 sm:mt-1 max-w-lg">
            Tell us your product, quantity, destination, and other requirements. Our trade desk will review your inquiry and get back to you.
          </p>

          {/* Close Button (44px+ accessible touch target) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote modal"
            className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Modal Body (Internal Scrollable) ──────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-8 sm:pb-6 overscroll-contain">
          {submitted ? (
            /* ── In-Modal Success State ─────────────────────────── */
            <div className="py-5 sm:py-7 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
                <svg
                  className="h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-navy-900 mb-2">
                Quote Request Received
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-1.5">
                Thank you{submittedName ? `, ${submittedName}` : ''} for your enquiry. Our export trade desk will review your requirements and contact you with the next steps.
              </p>

              <p className="text-xs text-slate-400 mb-5">
                Typical response window: 1–2 business days.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-2.5 sm:py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  Done
                </button>
                <a
                  href="https://wa.me/916353855938"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            /* ── Form View ──────────────────────────────────────── */
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
              {submitError && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
                  <svg
                    className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Row 1: Full Name * & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-fullName"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.fullName}
                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
                      errors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-0.5">{errors.fullName}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-companyName"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Company Name
                  </label>
                  <input
                    id="modal-companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your business or trading name"
                    autoComplete="organization"
                    className="block w-full rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                  />
                </div>
              </div>

              {/* Row 2: Country * & Email Address * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-country"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Destination country"
                    autoComplete="country-name"
                    aria-invalid={!!errors.country}
                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
                      errors.country ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-600 mt-0.5">{errors.country}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-email"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
                      errors.email ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Phone / WhatsApp & Product of Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-phone"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    autoComplete="tel"
                    className="block w-full rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="modal-product"
                    className="text-xs sm:text-[13px] font-semibold text-navy-900"
                  >
                    Product of Interest
                  </label>
                  <div className="relative">
                    <select
                      id="modal-product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-base sm:text-sm text-navy-950 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 appearance-none"
                    >
                      {productOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Quantity / Requirement */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="modal-quantity"
                  className="text-xs sm:text-[13px] font-semibold text-navy-900"
                >
                  Quantity / Requirement
                </label>
                <input
                  id="modal-quantity"
                  name="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 1x20ft FCL, 50 MT, trial shipment"
                  className="block w-full rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                />
              </div>

              {/* Row 5: Your Message * */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="modal-message"
                  className="text-xs sm:text-[13px] font-semibold text-navy-900"
                >
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please specify destination port, delivery terms (FOB/CIF), packaging preference, or target timeline…"
                  aria-invalid={!!errors.message}
                  className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base sm:text-sm text-navy-950 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
                    errors.message ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-0.5">{errors.message}</p>
                )}
              </div>

              {/* Actions Section: Primary Submit + WhatsApp Secondary */}
              <div className="pt-1.5 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-300 disabled:cursor-not-allowed text-navy-950 text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 min-h-[46px] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy-950"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Submitting Quote Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quote Request</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span>or connect directly</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <a
                  href="https://wa.me/916353855938"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors min-h-[44px] cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * Global Quote Modal container.
 */
const QuoteModal = () => {
  const { isOpen, selectedProduct, closeQuoteModal } = useQuoteModal()

  if (!isOpen) return null

  return <QuoteDialog initialProduct={selectedProduct} onClose={closeQuoteModal} />
}

export default QuoteModal
