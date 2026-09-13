import { useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from '../../services/categories'
import {
  fetchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  toggleSubcategoryActive,
} from '../../services/subcategories'

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', description: '', is_active: true }

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FORM MODAL (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────

const CategoryFormModal = ({ isOpen, onClose, onSaved, editCategory = null }) => {
  const isEdit = Boolean(editCategory)

  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const [prevEditCategory, setPrevEditCategory] = useState(editCategory)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  if (isOpen !== prevIsOpen || editCategory !== prevEditCategory) {
    setPrevIsOpen(isOpen)
    setPrevEditCategory(editCategory)
    setForm(
      isOpen && editCategory
        ? {
            name: editCategory.name || '',
            description: editCategory.description || '',
            is_active: editCategory.is_active !== false,
          }
        : EMPTY_FORM,
    )
    setFormError(null)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setFormError('Category name is required.')
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      let result
      if (isEdit) {
        result = await updateCategory(editCategory.id, form)
      } else {
        result = await createCategory(form)
      }

      if (result.error) {
        const msg = result.error?.message || ''
        // Supabase unique-violation code
        if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('slug')) {
          setFormError('A category with this name already exists. Please choose a different name.')
        } else {
          setFormError(msg || 'Failed to save category. Please try again.')
        }
        return
      }

      onSaved(result.data, isEdit)
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { if (!saving) onClose() }}
      title={isEdit ? 'Edit Category' : 'Add New Category'}
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            variant="primary"
            size="sm"
            loading={saving}
            disabled={saving}
          >
            {isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4" noValidate>

        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <svg className="h-4 w-4 shrink-0 mt-0.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-2.72 2.72a.75.75 0 101.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p>{formError}</p>
          </div>
        )}

        {/* Category Name */}
        <div>
          <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cat-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Dry Fruits"
            disabled={saving}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 disabled:opacity-50 bg-white"
            maxLength={80}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="cat-description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this category…"
            rows={2}
            disabled={saving}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 disabled:opacity-50 bg-white resize-none"
            maxLength={300}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cat-status"
                value="active"
                checked={form.is_active}
                onChange={() => handleChange('is_active', true)}
                disabled={saving}
                className="accent-navy-600"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cat-status"
                value="inactive"
                checked={!form.is_active}
                onChange={() => handleChange('is_active', false)}
                disabled={saving}
                className="accent-navy-600"
              />
              <span className="text-sm text-gray-700">Inactive</span>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Inactive categories are hidden from the public website.
          </p>
        </div>

      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────

const DeleteModal = ({ category, onClose, onConfirmDelete, onDeactivate, deleting }) => {
  const productCount = category?.product_count ?? 0
  const inUse = productCount > 0

  return (
    <Modal
      isOpen={Boolean(category)}
      onClose={() => { if (!deleting) onClose() }}
      title="Delete Category"
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={deleting}
            onClick={onClose}
          >
            Cancel
          </Button>
          {inUse ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={deleting}
              disabled={deleting}
              onClick={onDeactivate}
            >
              Deactivate Instead
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={deleting}
              onClick={onConfirmDelete}
            >
              Delete Permanently
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {inUse ? (
          <>
            {/* Blocked — products exist */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">Cannot delete — category in use</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  <strong>&quot;{category?.name}&quot;</strong> is currently assigned to{' '}
                  <strong>{productCount} product{productCount !== 1 ? 's' : ''}</strong>.
                  Reassign or delete those products before removing this category.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              As a safer alternative, you can <strong>deactivate</strong> the category. It will be
              hidden from the public website but your product records will remain intact.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              Are you sure you want to permanently delete{' '}
              <strong className="text-navy-800">&quot;{category?.name}&quot;</strong>?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This action cannot be undone. Products without a category will show as "Uncategorized".
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCATEGORY FORM MODAL (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────

const SubcategoryFormModal = ({
  isOpen,
  onClose,
  onSaved,
  editSubcategory = null,
  category = null,
}) => {
  const isEdit = Boolean(editSubcategory)

  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const [prevEditSubcategory, setPrevEditSubcategory] = useState(editSubcategory)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  if (isOpen !== prevIsOpen || editSubcategory !== prevEditSubcategory) {
    setPrevIsOpen(isOpen)
    setPrevEditSubcategory(editSubcategory)
    setForm(
      isOpen && editSubcategory
        ? {
            name: editSubcategory.name || '',
            description: editSubcategory.description || '',
            is_active: editSubcategory.is_active !== false,
          }
        : EMPTY_FORM,
    )
    setFormError(null)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setFormError('Subcategory name is required.')
      return
    }

    if (!isEdit && !category?.id) {
      setFormError('Parent category is missing.')
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      let result
      if (isEdit) {
        result = await updateSubcategory(editSubcategory.id, form)
      } else {
        result = await createSubcategory({
          ...form,
          category_id: category.id,
        })
      }

      if (result.error) {
        const msg = result.error?.message || ''
        if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('slug')) {
          setFormError('A subcategory with this name already exists in this category. Please choose a different name.')
        } else {
          setFormError(msg || 'Failed to save subcategory. Please try again.')
        }
        return
      }

      onSaved(result.data, isEdit)
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  const title = isEdit
    ? `Edit Subcategory: ${editSubcategory?.name}`
    : `Add Subcategory under "${category?.name || 'Category'}"`

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { if (!saving) onClose() }}
      title={title}
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="subcategory-form"
            variant="primary"
            size="sm"
            loading={saving}
            disabled={saving}
          >
            {isEdit ? 'Save Changes' : 'Create Subcategory'}
          </Button>
        </>
      }
    >
      <form id="subcategory-form" onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider mb-1.5">
            Subcategory Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Ground Spices, Whole Spices"
            disabled={saving}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-navy-600 focus:ring-1 focus:ring-navy-600 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider mb-1.5">
            Description <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this subcategory..."
            disabled={saving}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-navy-600 focus:ring-1 focus:ring-navy-600 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <div className="flex items-center gap-4 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sub_is_active"
                checked={form.is_active === true}
                onChange={() => handleChange('is_active', true)}
                disabled={saving}
                className="accent-navy-600"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sub_is_active"
                checked={form.is_active === false}
                onChange={() => handleChange('is_active', false)}
                disabled={saving}
                className="accent-navy-600"
              />
              <span className="text-sm text-gray-700">Inactive</span>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Inactive subcategories are hidden from the public filter bar.
          </p>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCATEGORY DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────

const SubcategoryDeleteModal = ({ subcategory, onClose, onConfirmDelete, onDeactivate, deleting }) => {
  const productCount = subcategory?.product_count ?? 0
  const inUse = productCount > 0

  return (
    <Modal
      isOpen={Boolean(subcategory)}
      onClose={() => { if (!deleting) onClose() }}
      title="Delete Subcategory"
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={deleting}
            onClick={onClose}
          >
            Cancel
          </Button>
          {inUse ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={deleting}
              disabled={deleting}
              onClick={onDeactivate}
            >
              Deactivate Instead
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={deleting}
              onClick={onConfirmDelete}
            >
              Delete Permanently
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {inUse ? (
          <>
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">Cannot delete — subcategory in use</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  <strong>&quot;{subcategory?.name}&quot;</strong> is assigned to{' '}
                  <strong>{productCount} product{productCount !== 1 ? 's' : ''}</strong>.
                  Reassign those products before removing this subcategory.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              You can <strong>deactivate</strong> the subcategory instead. It will be
              hidden from the public filter while keeping products intact.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              Are you sure you want to permanently delete{' '}
              <strong className="text-navy-800">&quot;{subcategory?.name}&quot;</strong>?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This action cannot be undone. Products currently under this subcategory will retain their parent category.
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [expandedCatIds, setExpandedCatIds] = useState(() => new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Category Modal state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  // Subcategory Modal state
  const [subFormModalOpen, setSubFormModalOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [targetCategoryForSub, setTargetCategoryForSub] = useState(null)
  const [deletingSubcategory, setDeletingSubcategory] = useState(null)

  // Inline action state
  const [togglingId, setTogglingId] = useState(null)
  const [togglingSubId, setTogglingSubId] = useState(null)
  const [deletingInProgress, setDeletingInProgress] = useState(false)
  const [actionError, setActionError] = useState(null)

  // Group subcategories by category_id
  const subsByCatId = useMemo(() => {
    const map = {}
    for (const sub of subcategories) {
      if (!map[sub.category_id]) map[sub.category_id] = []
      map[sub.category_id].push(sub)
    }
    return map
  }, [subcategories])

  const toggleExpand = useCallback((catId) => {
    setExpandedCatIds((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }, [])

  // ── Load categories & subcategories ───────────────────────────
  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [{ data: catData, error: catErr }, { data: subData, error: subErr }] =
          await Promise.all([fetchCategories(), fetchSubcategories()])

        if (!mounted) return

        if (catErr) {
          setError(catErr.message || 'Failed to load categories')
        } else {
          setCategories(catData || [])
        }

        if (subErr) {
          console.warn('Could not load subcategories:', subErr)
        } else {
          setSubcategories(subData || [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unexpected error loading data')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [retryCount])

  // ── Category Add / Edit handlers ──────────────────────────────
  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormModalOpen(true)
    setActionError(null)
  }

  const handleOpenEdit = useCallback((cat) => {
    setEditingCategory(cat)
    setFormModalOpen(true)
    setActionError(null)
  }, [])

  const handleFormSaved = useCallback((savedCat, isEdit) => {
    setCategories((prev) => {
      if (isEdit) {
        return prev.map((c) =>
          c.id === savedCat.id
            ? { ...savedCat, product_count: c.product_count ?? 0 }
            : c,
        )
      }
      return [{ ...savedCat, product_count: 0 }, ...prev].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
    })
    setFormModalOpen(false)
    setEditingCategory(null)
  }, [])

  // ── Toggle active ──────────────────────────────────────────────
  const handleToggleActive = useCallback(async (cat) => {
    if (togglingId) return
    setTogglingId(cat.id)
    setActionError(null)

    try {
      const { data, error: toggleErr } = await toggleCategoryActive(cat.id, cat.is_active)
      if (toggleErr) {
        setActionError(`Failed to update status: ${toggleErr.message}`)
      } else if (data) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === data.id ? { ...data, product_count: c.product_count ?? 0 } : c,
          ),
        )
      }
    } catch (err) {
      setActionError(`Error: ${err.message}`)
    } finally {
      setTogglingId(null)
    }
  }, [togglingId])

  // ── Delete ─────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return
    setDeletingInProgress(true)
    setActionError(null)

    try {
      const { success, productCount, error: delErr } = await deleteCategory(deletingCategory.id)

      if (!success) {
        if (productCount > 0) {
          // Close delete modal and show action error — category is in use
          setActionError(
            `"${deletingCategory.name}" is assigned to ${productCount} product${productCount !== 1 ? 's' : ''}. Reassign those products first, or deactivate the category.`,
          )
          setDeletingCategory(null)
          return
        }
        throw new Error(delErr?.message || 'Failed to delete category')
      }

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id))
      setDeletingCategory(null)
    } catch (err) {
      setActionError(err.message || 'Error deleting category')
    } finally {
      setDeletingInProgress(false)
    }
  }

  const handleDeactivateInstead = async () => {
    if (!deletingCategory) return
    setDeletingInProgress(true)

    try {
      const { data, error: updateErr } = await updateCategory(deletingCategory.id, { is_active: false })
      if (updateErr) {
        setActionError(`Failed to deactivate: ${updateErr.message}`)
      } else if (data) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === data.id ? { ...data, product_count: c.product_count ?? 0 } : c,
          ),
        )
      }
      setDeletingCategory(null)
    } catch (err) {
      setActionError(`Error deactivating category: ${err.message}`)
    } finally {
      setDeletingInProgress(false)
    }
  }

  // ── Subcategory handlers ───────────────────────────────────────
  const handleOpenAddSub = (cat) => {
    setTargetCategoryForSub(cat)
    setEditingSubcategory(null)
    setSubFormModalOpen(true)
    setActionError(null)
  }

  const handleOpenEditSub = (sub, cat) => {
    setTargetCategoryForSub(cat)
    setEditingSubcategory(sub)
    setSubFormModalOpen(true)
    setActionError(null)
  }

  const handleSubSaved = (savedSub, isEdit) => {
    setSubcategories((prev) => {
      if (isEdit) {
        return prev.map((s) => (s.id === savedSub.id ? savedSub : s))
      }
      return [...prev, savedSub].sort((a, b) => a.name.localeCompare(b.name))
    })

    if (savedSub.category_id) {
      setExpandedCatIds((prev) => new Set([...prev, savedSub.category_id]))
    }

    setSubFormModalOpen(false)
    setEditingSubcategory(null)
    setTargetCategoryForSub(null)
  }

  const handleToggleSubActive = async (sub) => {
    if (togglingSubId) return
    setTogglingSubId(sub.id)
    setActionError(null)

    try {
      const { data, error: toggleErr } = await toggleSubcategoryActive(sub.id, sub.is_active)
      if (toggleErr) {
        setActionError(`Failed to update subcategory status: ${toggleErr.message}`)
      } else if (data) {
        setSubcategories((prev) =>
          prev.map((s) => (s.id === data.id ? data : s)),
        )
      }
    } catch (err) {
      setActionError(`Error: ${err.message}`)
    } finally {
      setTogglingSubId(null)
    }
  }

  const handleConfirmDeleteSub = async () => {
    if (!deletingSubcategory) return
    setDeletingInProgress(true)
    setActionError(null)

    try {
      const { success, productCount, error: delErr } = await deleteSubcategory(deletingSubcategory.id)

      if (!success) {
        if (productCount > 0) {
          setActionError(
            `"${deletingSubcategory.name}" is assigned to ${productCount} product${productCount !== 1 ? 's' : ''}. Reassign those products first, or deactivate the subcategory.`,
          )
          setDeletingSubcategory(null)
          return
        }
        throw new Error(delErr?.message || 'Failed to delete subcategory')
      }

      setSubcategories((prev) => prev.filter((s) => s.id !== deletingSubcategory.id))
      setDeletingSubcategory(null)
    } catch (err) {
      setActionError(err.message || 'Error deleting subcategory')
    } finally {
      setDeletingInProgress(false)
    }
  }

  const handleDeactivateSubInstead = async () => {
    if (!deletingSubcategory) return
    setDeletingInProgress(true)

    try {
      const { data, error: updateErr } = await updateSubcategory(deletingSubcategory.id, { is_active: false })
      if (updateErr) {
        setActionError(`Failed to deactivate subcategory: ${updateErr.message}`)
      } else if (data) {
        setSubcategories((prev) =>
          prev.map((s) => (s.id === data.id ? data : s)),
        )
      }
      setDeletingSubcategory(null)
    } catch (err) {
      setActionError(`Error deactivating subcategory: ${err.message}`)
    } finally {
      setDeletingInProgress(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Manage Categories | Admin Portal | Akshar Worldtrade</title>
      </Helmet>

      <div className="space-y-6">

        {/* ── Header Bar ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
              Category Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Create and manage product categories. Active categories appear on the public website.
            </p>
          </div>

          <button
            type="button"
            id="btn-add-category"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-700 active:bg-navy-800 text-white text-sm font-semibold rounded shadow-sm transition-colors self-start sm:self-auto"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Category
          </button>
        </div>

        {/* ── Action Error Banner ────────────────────────────────── */}
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
              className="text-red-500 hover:text-red-700 font-bold ml-4 text-lg leading-none"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Table Container ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">

          {/* Loading */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" color="navy" label="Loading categories…" />
              <p className="text-sm text-gray-500">Retrieving category list…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-8">
              <EmptyState
                icon={
                  <svg className="h-14 w-14 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                }
                title="Failed to load categories"
                description={error}
                action={
                  <button
                    type="button"
                    onClick={() => setRetryCount((c) => c + 1)}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Retry
                  </button>
                }
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <div className="p-8">
              <EmptyState
                icon={
                  <svg className="h-14 w-14 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                }
                title="No categories yet"
                description="Create your first product category to organise your export catalog and enable dynamic filtering on the public website."
                action={
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    + Add First Category
                  </button>
                }
              />
            </div>
          )}

          {/* Table */}
          {!loading && !error && categories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-surface/80 border-b border-gray-100 text-3xs sm:text-2xs uppercase tracking-wider font-semibold text-gray-500 select-none">
                    <th className="py-3.5 pl-4 sm:pl-6 pr-3">Category Name</th>
                    <th className="py-3.5 px-3">Products</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Created</th>
                    <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {categories.map((cat) => {
                    const isBusy = togglingId === cat.id
                    const productCount = cat.product_count ?? 0
                    const catSubs = subsByCatId[cat.id] || []
                    const isExpanded = expandedCatIds.has(cat.id)

                    return (
                      <Fragment key={cat.id}>
                        <tr className="hover:bg-surface/40 transition-colors group">

                          {/* Name + Description + Expand Toggle */}
                          <td className="py-3.5 pl-4 sm:pl-6 pr-3">
                            <div className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() => toggleExpand(cat.id)}
                                className="p-1 -ml-1 mt-0.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded transition-colors"
                                title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                                aria-expanded={isExpanded}
                              >
                                <svg
                                  className={`h-4 w-4 transform transition-transform ${
                                    isExpanded ? 'rotate-90 text-navy-600' : ''
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <div>
                                <p className="font-semibold text-navy-800 flex items-center gap-2">
                                  <span>{cat.name}</span>
                                  {catSubs.length > 0 && (
                                    <span
                                      onClick={() => toggleExpand(cat.id)}
                                      className="cursor-pointer text-3xs font-semibold px-1.5 py-0.5 rounded bg-navy-50 text-navy-600 border border-navy-100 hover:bg-navy-100"
                                      title="Toggle subcategories"
                                    >
                                      {catSubs.length} {catSubs.length === 1 ? 'sub' : 'subs'}
                                    </span>
                                  )}
                                </p>
                                {cat.description && (
                                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs" title={cat.description}>
                                    {cat.description}
                                  </p>
                                )}
                                <p className="text-2xs text-gray-300 font-mono mt-0.5">/{cat.slug}</p>
                              </div>
                            </div>
                          </td>

                          {/* Product Count & Subcategories Count */}
                          <td className="py-3.5 px-3">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                                productCount > 0
                                  ? 'bg-navy-50 text-navy-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {productCount}
                                <span className="font-normal text-2xs">{productCount === 1 ? 'product' : 'products'}</span>
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleActive(cat)}
                              title={cat.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                                cat.is_active
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${cat.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                              {isBusy ? '…' : cat.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>

                          {/* Created Date */}
                          <td className="py-3.5 px-3 text-xs text-gray-400">
                            {formatDate(cat.created_at)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">

                              {/* Add Subcategory quick button */}
                              <button
                                type="button"
                                onClick={() => handleOpenAddSub(cat)}
                                className="px-2 py-1 text-2xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 rounded transition-colors"
                                title={`Add subcategory under ${cat.name}`}
                              >
                                + Sub
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cat)}
                                className="p-1.5 text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded transition-colors"
                                title="Edit category"
                                aria-label={`Edit category ${cat.name}`}
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDeletingCategory(cat)
                                  setActionError(null)
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete category"
                                aria-label={`Delete category ${cat.name}`}
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zm3.59.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>

                        </tr>

                        {/* Expanded Subcategory Panel */}
                        {isExpanded && (
                          <tr className="bg-surface/70 border-b border-gray-100">
                            <td colSpan={5} className="py-3 px-4 sm:px-10">
                              <div className="bg-white rounded-lg border border-gray-200/80 p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                                      Subcategories of {cat.name}
                                    </span>
                                    <span className="text-2xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                                      {catSubs.length}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddSub(cat)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-800 bg-navy-50 hover:bg-navy-100 px-2.5 py-1 rounded transition-colors"
                                  >
                                    + Add Subcategory
                                  </button>
                                </div>

                                {catSubs.length === 0 ? (
                                  <div className="py-4 text-center">
                                    <p className="text-xs text-gray-400 italic">
                                      No subcategories created yet for {cat.name}.
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddSub(cat)}
                                      className="mt-2 text-xs font-medium text-navy-600 hover:underline"
                                    >
                                      + Create first subcategory
                                    </button>
                                  </div>
                                ) : (
                                  <div className="divide-y divide-gray-100">
                                    {catSubs.map((sub) => {
                                      const subBusy = togglingSubId === sub.id
                                      return (
                                        <div key={sub.id} className="py-2.5 flex items-center justify-between gap-4">
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium text-navy-900">{sub.name}</p>
                                              <span className="text-2xs text-gray-400 font-mono">/{sub.slug}</span>
                                            </div>
                                            {sub.description && (
                                              <p className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                                                {sub.description}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2.5 shrink-0">
                                            {/* Sub status toggle */}
                                            <button
                                              type="button"
                                              disabled={subBusy}
                                              onClick={() => handleToggleSubActive(sub)}
                                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                                                sub.is_active
                                                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                              } ${subBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                                              title={sub.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                                            >
                                              <span className={`h-1.5 w-1.5 rounded-full ${sub.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                              {subBusy ? '…' : sub.is_active ? 'Active' : 'Inactive'}
                                            </button>

                                            {/* Edit Sub */}
                                            <button
                                              type="button"
                                              onClick={() => handleOpenEditSub(sub, cat)}
                                              className="p-1 text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded transition-colors"
                                              title="Edit subcategory"
                                            >
                                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                              </svg>
                                            </button>

                                            {/* Delete Sub */}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setDeletingSubcategory(sub)
                                                setActionError(null)
                                              }}
                                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                              title="Delete subcategory"
                                            >
                                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zm3.59.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>

              {/* Footer count */}
              <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-surface/50 text-xs text-gray-500">
                <strong className="text-navy-800">{categories.length}</strong>{' '}
                {categories.length === 1 ? 'category' : 'categories'} total
                {' · '}
                <strong className="text-navy-800">{categories.filter((c) => c.is_active).length}</strong> active
                {' · '}
                <strong className="text-navy-800">{subcategories.length}</strong> subcategories ({subcategories.filter((s) => s.is_active).length} active)
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Add / Edit Modal ────────────────────────────────────── */}
      <CategoryFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingCategory(null)
        }}
        onSaved={handleFormSaved}
        editCategory={editingCategory}
      />

      {/* ── Subcategory Add / Edit Modal ─────────────────────────── */}
      <SubcategoryFormModal
        isOpen={subFormModalOpen}
        onClose={() => {
          setSubFormModalOpen(false)
          setEditingSubcategory(null)
          setTargetCategoryForSub(null)
        }}
        onSaved={handleSubSaved}
        editSubcategory={editingSubcategory}
        category={targetCategoryForSub}
      />

      {/* ── Delete Confirmation Modal ───────────────────────────── */}
      <DeleteModal
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirmDelete={handleConfirmDelete}
        onDeactivate={handleDeactivateInstead}
        deleting={deletingInProgress}
      />

      {/* ── Subcategory Delete Confirmation Modal ───────────────── */}
      <SubcategoryDeleteModal
        subcategory={deletingSubcategory}
        onClose={() => setDeletingSubcategory(null)}
        onConfirmDelete={handleConfirmDeleteSub}
        onDeactivate={handleDeactivateSubInstead}
        deleting={deletingInProgress}
      />
    </>
  )
}

export default AdminCategoriesPage
