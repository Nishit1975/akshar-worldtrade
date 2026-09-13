import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import SpecificationsEditor from './SpecificationsEditor'
import ImageUploader from './ImageUploader'
import { fetchCategories, createCategory } from '../../services/categories'
import { fetchSubcategories } from '../../services/subcategories'
import {
  createProduct,
  updateProduct,
  checkSlugUnique,
} from '../../services/products'
import {
  uploadProductImage,
  uploadProductGalleryImage,
} from '../../services/storage'

/**
 * Generate URL-friendly slug from title string.
 */
function generateSlug(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * ProductForm — Comprehensive admin product form.
 *
 * @param {Object} [initialData] - Existing product data for edit mode
 * @param {boolean} isEdit - True if editing existing product
 */
const ProductForm = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate()

  // Form fields
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [autoSlug, setAutoSlug] = useState(!isEdit)
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || initialData?.categories?.id || '',
  )
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description || '',
  )
  const [fullDescription, setFullDescription] = useState(
    initialData?.full_description || '',
  )
  const [packaging, setPackaging] = useState(initialData?.packaging || '')
  const [moq, setMoq] = useState(initialData?.moq || '')
  const [origin, setOrigin] = useState(
    initialData?.origin || 'India',
  )
  const [featured, setFeatured] = useState(Boolean(initialData?.featured))
  const [status, setStatus] = useState(initialData?.status || 'draft')
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || {},
  )

  // Images state
  const [existingMainImage, setExistingMainImage] = useState(
    initialData?.main_image || null,
  )
  const [stagedMainFile, setStagedMainFile] = useState(null)
  const [existingGallery, setExistingGallery] = useState(
    initialData?.gallery_images || [],
  )
  const [stagedGalleryFiles, setStagedGalleryFiles] = useState([])

  // Categories list
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Subcategories state (dynamic based on selected category)
  const [subcategoryId, setSubcategoryId] = useState(
    initialData?.subcategory_id || initialData?.subcategories?.id || '',
  )
  const [subcategories, setSubcategories] = useState([])
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const prevCategoryRef = useRef(categoryId)

  // Quick-add category modal state
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddName, setQuickAddName] = useState('')
  const [quickAddSaving, setQuickAddSaving] = useState(false)
  const [quickAddError, setQuickAddError] = useState(null)

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [submitStepText, setSubmitStepText] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Generate or use product UUID for storage folder
  const [productId] = useState(() => initialData?.id || crypto.randomUUID())

  // Load categories (all for admin, including inactive)
  useEffect(() => {
    let mounted = true
    async function loadCats() {
      const { data, error } = await fetchCategories()
      if (mounted) {
        if (!error && data) {
          setCategories(data)
        }
        setLoadingCategories(false)
      }
    }
    loadCats()
    return () => {
      mounted = false
    }
  }, [])

  // Load subcategories whenever categoryId changes
  useEffect(() => {
    let mounted = true
    async function loadSubs() {
      if (!categoryId) {
        setSubcategories([])
        setSubcategoryId('')
        prevCategoryRef.current = ''
        return
      }

      setLoadingSubcategories(true)
      const { data } = await fetchSubcategories(categoryId)
      if (mounted) {
        setSubcategories(data || [])
        // If the main category changed after initial mount, reset subcategoryId
        if (prevCategoryRef.current && prevCategoryRef.current !== categoryId) {
          setSubcategoryId('')
        }
        prevCategoryRef.current = categoryId
        setLoadingSubcategories(false)
      }
    }
    loadSubs()
    return () => {
      mounted = false
    }
  }, [categoryId])

  // Quick-add category handler
  const handleQuickAddCategory = async (e) => {
    e.preventDefault()
    if (!quickAddName.trim()) {
      setQuickAddError('Category name is required.')
      return
    }
    setQuickAddSaving(true)
    setQuickAddError(null)
    try {
      const { data, error: createErr } = await createCategory({
        name: quickAddName.trim(),
        is_active: true,
      })
      if (createErr) {
        const msg = createErr?.message || ''
        if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('slug')) {
          setQuickAddError('A category with this name already exists.')
        } else {
          setQuickAddError(msg || 'Failed to create category.')
        }
        return
      }
      // Add to list and auto-select
      setCategories((prev) =>
        [...prev, { ...data, product_count: 0 }].sort((a, b) => a.name.localeCompare(b.name))
      )
      setCategoryId(data.id)
      if (formErrors.categoryId) {
        setFormErrors((prev) => ({ ...prev, categoryId: null }))
      }
      setQuickAddOpen(false)
      setQuickAddName('')
    } catch (err) {
      setQuickAddError(err.message || 'Unexpected error.')
    } finally {
      setQuickAddSaving(false)
    }
  }

  // Auto-slug generator when name changes
  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    if (autoSlug) {
      setSlug(generateSlug(val))
    }
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: null }))
    }
  }

  const handleSlugChange = (e) => {
    setAutoSlug(false)
    setSlug(generateSlug(e.target.value))
    if (formErrors.slug) {
      setFormErrors((prev) => ({ ...prev, slug: null }))
    }
  }

  // Validate all fields
  const validateForm = async () => {
    const errors = {}

    if (!name.trim()) errors.name = 'Product name is required'
    if (!slug.trim()) errors.slug = 'Product slug is required'
    if (!categoryId) errors.categoryId = 'Category selection is required'
    if (!shortDescription.trim())
      errors.shortDescription = 'Short summary description is required'
    if (!fullDescription.trim())
      errors.fullDescription = 'Full product description is required'
    if (!packaging.trim())
      errors.packaging = 'Packaging details are required (e.g. 25kg / 50kg Bags)'
    if (!moq.trim())
      errors.moq = 'Minimum Order Quantity is required (e.g. 1 x 20ft FCL)'
    if (!origin.trim()) errors.origin = 'Country / Region of origin is required'

    // If publishing, main image must be present
    if (status === 'published' && !existingMainImage && !stagedMainFile) {
      errors.mainImage =
        'A main product image is required before publishing to public catalog.'
    }

    // Check slug uniqueness
    if (slug.trim()) {
      const { isUnique, error } = await checkSlugUnique(
        slug.trim(),
        isEdit ? initialData.id : null,
      )
      if (!error && !isUnique) {
        errors.slug = `Slug "${slug}" is already in use by another product. Please choose a unique slug.`
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError(null)
    setSuccessMessage(null)

    const isValid = await validateForm()
    if (!isValid) {
      setGlobalError('Please resolve the highlighted validation errors.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      let finalMainImage = existingMainImage
      let finalGalleryImages = [...existingGallery]

      // 1. Upload Staged Main Image if present
      if (stagedMainFile) {
        setSubmitStepText('Uploading main product image…')
        const { data: uploadRes, error: uploadErr } = await uploadProductImage(
          stagedMainFile,
          productId,
        )
        if (uploadErr) {
          throw new Error(`Main image upload failed: ${uploadErr.message}`)
        }
        finalMainImage = uploadRes.publicUrl
      }

      // 2. Upload Staged Gallery Images if present
      if (stagedGalleryFiles.length > 0) {
        setSubmitStepText(
          `Uploading ${stagedGalleryFiles.length} gallery image${stagedGalleryFiles.length > 1 ? 's' : ''}…`,
        )
        for (const file of stagedGalleryFiles) {
          const { data: galRes, error: galErr } =
            await uploadProductGalleryImage(file, productId)
          if (galErr) {
            throw new Error(`Gallery image upload failed: ${galErr.message}`)
          }
          finalGalleryImages.push(galRes.publicUrl)
        }
      }

      // 3. Save to Supabase public.products
      setSubmitStepText('Saving product to database…')

      const productPayload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        short_description: shortDescription.trim(),
        full_description: fullDescription.trim(),
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        main_image: finalMainImage || null,
        gallery_images: finalGalleryImages,
        specifications,
        packaging: packaging.trim(),
        moq: moq.trim(),
        origin: origin.trim(),
        featured,
        status,
      }

      let saveResult
      if (isEdit) {
        saveResult = await updateProduct(initialData.id, productPayload)
      } else {
        saveResult = await createProduct({
          id: productId,
          ...productPayload,
        })
      }

      if (saveResult.error) {
        throw new Error(saveResult.error.message || 'Failed to save product in database')
      }

      setSuccessMessage(
        isEdit
          ? 'Product updated successfully!'
          : 'Product created successfully!',
      )

      // Short pause then navigate back to product list
      setTimeout(() => {
        navigate('/admin/products')
      }, 800)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('ProductForm submission exception:', err)
      }
      setGlobalError(err.message || 'An unexpected error occurred. Please try again.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
      setSubmitStepText('')
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>

      {/* ── Global Alerts ─────────────────────────────────────── */}
      {globalError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
          <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-2.72 2.72a.75.75 0 101.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Unable to save product</p>
            <p className="text-xs mt-0.5 text-red-600">{globalError}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 text-sm">
          <svg className="h-5 w-5 text-green-600 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* ── CARD 1: Basic Information ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
        <h2 className="text-base font-semibold text-navy-800 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-navy-600 rounded-full" />
          General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="md:col-span-2">
            <Input
              id="product-name"
              label="Product Name"
              required
              placeholder="e.g. 1121 Basmati Rice (Steam / Sella)"
              value={name}
              onChange={handleNameChange}
              error={formErrors.name}
              disabled={submitting}
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="product-slug" className="text-sm font-medium text-gray-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setAutoSlug(true)
                  setSlug(generateSlug(name))
                }}
                className="text-2xs text-navy-600 hover:text-navy-800 underline"
              >
                Auto-generate
              </button>
            </div>
            <div className="flex items-center rounded border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-navy-500 focus-within:border-navy-500">
              <span className="pl-3 text-xs text-gray-400 select-none">/products/</span>
              <input
                id="product-slug"
                type="text"
                value={slug}
                onChange={handleSlugChange}
                disabled={submitting}
                placeholder="1121-basmati-rice"
                className="w-full bg-transparent px-2 py-2.5 text-sm text-gray-900 focus:outline-none"
              />
            </div>
            {formErrors.slug && (
              <p className="text-xs text-red-600 mt-1">{formErrors.slug}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Select
              id="product-category"
              label="Category"
              required
              placeholder={loadingCategories ? 'Loading categories…' : 'Select a category'}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                if (formErrors.categoryId) {
                  setFormErrors((prev) => ({ ...prev, categoryId: null }))
                }
              }}
              error={formErrors.categoryId}
              disabled={submitting || loadingCategories}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            {/* Quick-add category link */}
            {!loadingCategories && (
              <button
                type="button"
                id="btn-quick-add-category"
                onClick={() => {
                  setQuickAddOpen(true)
                  setQuickAddName('')
                  setQuickAddError(null)
                }}
                className="mt-1.5 text-xs text-navy-600 hover:text-navy-800 underline"
                disabled={submitting}
              >
                + Add New Category
              </button>
            )}
          </div>

          {/* Subcategory (Optional, dynamic based on selected Category) */}
          {categoryId && (subcategories.length > 0 || loadingSubcategories) && (
            <div>
              <Select
                id="product-subcategory"
                label="Subcategory"
                placeholder={
                  loadingSubcategories
                    ? 'Loading subcategories…'
                    : 'None / General (Optional)'
                }
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={submitting || loadingSubcategories}
                options={subcategories.map((s) => ({
                  value: s.id,
                  label: s.is_active ? s.name : `${s.name} (Inactive)`,
                }))}
                helper="Optional subcategory classification."
              />
            </div>
          )}

          {/* Status */}
          <div>
            <Select
              id="product-status"
              label="Publish Status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={submitting}
              options={[
                { value: 'draft', label: 'Draft (Hidden from public site)' },
                { value: 'published', label: 'Published (Live in catalog)' },
              ]}
              helper="Draft items remain private to admin and do not show on the public website."
            />
          </div>

          {/* Featured switch */}
          <div className="flex flex-col justify-center">
            <label className="text-sm font-medium text-gray-700 mb-2">Featured on Homepage</label>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                disabled={submitting}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-navy-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {featured ? 'Featured on Home' : 'Standard Product'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── CARD 2: Descriptions ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
        <h2 className="text-base font-semibold text-navy-800 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-navy-600 rounded-full" />
          Product Descriptions
        </h2>

        {/* Short Description */}
        <Textarea
          id="product-short-description"
          label="Short Description (Summary Card)"
          required
          rows={2}
          placeholder="Brief 1-2 sentence overview for product cards and search results…"
          value={shortDescription}
          onChange={(e) => {
            setShortDescription(e.target.value)
            if (formErrors.shortDescription) {
              setFormErrors((prev) => ({ ...prev, shortDescription: null }))
            }
          }}
          error={formErrors.shortDescription}
          disabled={submitting}
          helper="Displayed on the catalog grid cards and meta description."
        />

        {/* Full Description */}
        <Textarea
          id="product-full-description"
          label="Full Detailed Description"
          required
          rows={6}
          placeholder="Comprehensive description of product quality, aroma, processing methods, culinary uses, and export grades…"
          value={fullDescription}
          onChange={(e) => {
            setFullDescription(e.target.value)
            if (formErrors.fullDescription) {
              setFormErrors((prev) => ({ ...prev, fullDescription: null }))
            }
          }}
          error={formErrors.fullDescription}
          disabled={submitting}
          helper="Displayed on the public product detail page. Separate paragraphs with a blank line."
        />
      </div>

      {/* ── CARD 3: Trade & Logistics ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
        <h2 className="text-base font-semibold text-navy-800 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-navy-600 rounded-full" />
          Trade & Export Logistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Packaging */}
          <div>
            <Input
              id="product-packaging"
              label="Packaging Options"
              required
              placeholder="e.g. 10kg, 25kg, 50kg PP / Non-Woven Bags"
              value={packaging}
              onChange={(e) => {
                setPackaging(e.target.value)
                if (formErrors.packaging) {
                  setFormErrors((prev) => ({ ...prev, packaging: null }))
                }
              }}
              error={formErrors.packaging}
              disabled={submitting}
            />
          </div>

          {/* MOQ */}
          <div>
            <Input
              id="product-moq"
              label="Minimum Order Quantity (MOQ)"
              required
              placeholder="e.g. 1 x 20ft FCL (18 MT)"
              value={moq}
              onChange={(e) => {
                setMoq(e.target.value)
                if (formErrors.moq) {
                  setFormErrors((prev) => ({ ...prev, moq: null }))
                }
              }}
              error={formErrors.moq}
              disabled={submitting}
            />
          </div>

          {/* Origin */}
          <div>
            <Input
              id="product-origin"
              label="Country / Region of Origin"
              required
              placeholder="e.g. India (Punjab & Haryana)"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value)
                if (formErrors.origin) {
                  setFormErrors((prev) => ({ ...prev, origin: null }))
                }
              }}
              error={formErrors.origin}
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      {/* ── CARD 4: Technical Specifications ──────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <SpecificationsEditor
          value={specifications}
          onChange={(updatedSpecs) => setSpecifications(updatedSpecs)}
        />
      </div>

      {/* ── CARD 5: Media & Storage ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-semibold text-navy-800 pb-3 border-b border-gray-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-navy-600 rounded-full" />
          Product Media (Supabase Storage)
        </h2>

        {formErrors.mainImage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-medium">
            {formErrors.mainImage}
          </div>
        )}

        <ImageUploader
          existingMainImage={existingMainImage}
          stagedMainFile={stagedMainFile}
          onMainImageChange={(file) => {
            setStagedMainFile(file)
            if (!file) setExistingMainImage(null)
            if (formErrors.mainImage) {
              setFormErrors((prev) => ({ ...prev, mainImage: null }))
            }
          }}
          existingGallery={existingGallery}
          stagedGalleryFiles={stagedGalleryFiles}
          onGalleryChange={({ existing, staged }) => {
            setExistingGallery(existing)
            setStagedGalleryFiles(staged)
          }}
          disabled={submitting}
        />
      </div>

      {/* ── Sticky Form Actions Bar ────────────────────────────── */}
      <div className="sticky bottom-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {submitting ? (
            <span className="text-navy-600 font-medium animate-pulse">
              {submitStepText || 'Processing request…'}
            </span>
          ) : (
            <span>
              Status: <span className="font-semibold text-navy-800 capitalize">{status}</span>
              {featured && <span className="ml-2 text-gold-600 font-medium">★ Featured</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            disabled={submitting}
            className="flex-1 sm:flex-none min-w-[140px]"
          >
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>

    </form>

      {/* ── Quick-Add Category Modal ─────────────────────────────── */}
      <Modal
        isOpen={quickAddOpen}
        onClose={() => { if (!quickAddSaving) { setQuickAddOpen(false); setQuickAddName(''); setQuickAddError(null) } }}
        title="Add New Category"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={quickAddSaving}
              onClick={() => { setQuickAddOpen(false); setQuickAddName(''); setQuickAddError(null) }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="quick-add-category-form"
              variant="primary"
              size="sm"
              loading={quickAddSaving}
              disabled={quickAddSaving}
            >
              Create &amp; Select
            </Button>
          </>
        }
      >
        <form id="quick-add-category-form" onSubmit={handleQuickAddCategory} className="space-y-4" noValidate>
          {quickAddError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 mt-0.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-2.72 2.72a.75.75 0 101.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <p>{quickAddError}</p>
            </div>
          )}
          <div>
            <label htmlFor="quick-cat-name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="quick-cat-name"
              type="text"
              value={quickAddName}
              onChange={(e) => { setQuickAddName(e.target.value); if (quickAddError) setQuickAddError(null) }}
              placeholder="e.g. Dry Fruits"
              disabled={quickAddSaving}
              autoFocus
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 disabled:opacity-50 bg-white"
              maxLength={80}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              The category will be created as <strong>Active</strong> and immediately available in this dropdown.
            </p>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default ProductForm
