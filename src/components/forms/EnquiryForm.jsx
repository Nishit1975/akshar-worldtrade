import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { getPublishedProducts } from '../../services/products'
import { submitEnquiry } from '../../services/enquiries'

const INITIAL_FORM = {
  fullName:    '',
  companyName: '',
  country:     '',
  email:       '',
  phone:       '',
  product:     '',
  quantity:    '',
  message:     '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (data) => {
  const errors = {}
  if (!data.fullName.trim())          errors.fullName = 'Full name is required.'
  if (!data.email.trim())             errors.email = 'Email address is required.'
  else if (!emailRegex.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (!data.country.trim())           errors.country = 'Country is required.'
  if (!data.message.trim())           errors.message = 'Please describe your requirement.'
  return errors
}

/**
 * Shared product enquiry form used on Quote and Contact pages.
 *
 * @param {string}   initialProduct - Pre-selected product name
 * @param {function} onSubmitted    - Called with formData on successful submit (parent handles success UI)
 * @param {boolean}  inlineSuccess  - Show inline success message when onSubmitted is not provided
 * @param {string}   className      - Additional classes for the form element
 */
const EnquiryForm = ({
  initialProduct = '',
  onSubmitted,
  inlineSuccess = false,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    product: initialProduct,
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

  // Keep formData.product synchronized if initialProduct prop updates after mount
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialProduct)
  if (prevInitialProduct !== initialProduct) {
    setPrevInitialProduct(initialProduct)
    if (initialProduct) {
      setFormData((prev) => ({ ...prev, product: initialProduct }))
    }
  }

  useEffect(() => {
    async function loadProductOptions() {
      try {
        const { data } = await getPublishedProducts()
        if (data && data.length > 0) {
          const names = data.map((p) => p.name)
          const dynamicOptions = [
            { value: '', label: 'Select a product (optional)' },
            ...data.map((p) => ({ value: p.name, label: p.name })),
          ]
          if (initialProduct && initialProduct !== 'other' && !names.includes(initialProduct)) {
            dynamicOptions.push({ value: initialProduct, label: initialProduct })
          }
          dynamicOptions.push({ value: 'other', label: 'Other / General Inquiry' })
          setProductOptions(dynamicOptions)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load product options for quote form:', err)
        }
      }
    }

    loadProductOptions()
  }, [initialProduct])

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
      const firstKey = Object.keys(validationErrors)[0]
      document.getElementById(firstKey)?.focus()
      return
    }

    setLoading(true)
    setSubmitError(null)

    try {
      const { error: submitErr } = await submitEnquiry({
        name:         formData.fullName,
        company_name: formData.companyName,
        country:      formData.country,
        email:        formData.email,
        phone:        formData.phone,
        product:      formData.product,
        quantity:     formData.quantity,
        message:      formData.message,
      })

      if (submitErr) {
        if (import.meta.env.DEV) {
          console.error('Enquiry submission error:', submitErr)
        }
        throw new Error('Unable to submit enquiry at this moment. Please check your connection or contact us directly.')
      }

      if (onSubmitted) {
        onSubmitted(formData)
      } else if (inlineSuccess) {
        setSubmitted(true)
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Enquiry submission exception:', err)
      }
      setSubmitError(err.message || 'We could not submit your quotation request. Please try again or reach out directly via email.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormData({ ...INITIAL_FORM, product: initialProduct })
    setErrors({})
    setSubmitError(null)
  }

  if (inlineSuccess && submitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-3.5">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-navy-800 mb-1.5">Thank you, {formData.fullName}!</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-1.5 max-w-sm mx-auto">
          Your enquiry has been submitted successfully. Our trade desk will review your requirements and get back to you with a detailed quotation.
        </p>
        <p className="text-xs text-gray-400 mb-4">Please allow 1–2 business days for a response.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-medium rounded transition-colors"
          >
            Browse Products
          </Link>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={['space-y-4', className].filter(Boolean).join(' ')}
      aria-label="Product enquiry form"
    >
      {submitError && (
        <div className="p-3.5 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
          <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          placeholder="Your full name"
          required
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
        />
        <Input
          id="companyName"
          name="companyName"
          label="Company Name"
          placeholder="Your company or business name"
          value={formData.companyName}
          onChange={handleChange}
          autoComplete="organization"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Input
          id="country"
          name="country"
          label="Country"
          placeholder="Your country"
          required
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
          autoComplete="country-name"
        />
        <Input
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Input
          id="phone"
          name="phone"
          label="Phone / WhatsApp"
          placeholder="+1 234 567 890"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        <Select
          id="product"
          name="product"
          label="Product of Interest"
          options={productOptions}
          placeholder=""
          value={formData.product}
          onChange={handleChange}
        />
      </div>

      <Input
        id="quantity"
        name="quantity"
        label="Quantity / Requirement"
        placeholder="e.g. 20 MT, 500 cartons, trial order"
        value={formData.quantity}
        onChange={handleChange}
        helper="Please specify the quantity or describe your volume requirement."
      />

      <Textarea
        id="message"
        name="message"
        label="Your Message"
        placeholder="Please describe your product requirements, destination country, delivery timeline, or any other relevant details…"
        required
        rows={4}
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
      />

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          {loading ? 'Submitting…' : 'Submit Enquiry'}
        </Button>
        <p className="mt-2 text-xs text-gray-400 text-center">
          We typically respond within 1–2 business days.
        </p>
      </div>
    </form>
  )
}

export default EnquiryForm
