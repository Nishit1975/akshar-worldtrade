import { supabase } from './supabase'
import { getCache, setCache, invalidateCache } from './cache'

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a text string.
 * @param {string} text
 * @returns {string}
 */
export function generateSlug(text) {
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

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — FETCH SUBCATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all subcategories for admin use (active + inactive), optionally filtered by category.
 * Includes assigned products count and parent category details.
 *
 * @param {string|null} [categoryId=null]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchSubcategories(categoryId = null) {
  try {
    let query = supabase
      .from('subcategories')
      .select(`
        id,
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug
        ),
        products (count)
      `)
      .order('name', { ascending: true })

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching subcategories:', error.message)
      }
      return { data: null, error }
    }

    const normalised = (data || []).map((sub) => ({
      ...sub,
      product_count: sub.products?.[0]?.count ?? 0,
    }))

    return { data: normalised, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in fetchSubcategories:', err)
    }
    return { data: null, error: err }
  }
}

// Convenient alias
export const getSubcategories = fetchSubcategories

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — FETCH ACTIVE SUBCATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch active subcategories for public use (e.g. Products page subcategory filter pills).
 *
 * @param {string|null} [categoryId=null]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchPublicSubcategories(categoryId = null) {
  try {
    const cacheKey = `public_subcategories_${categoryId || 'all'}`
    const cached = getCache(cacheKey)
    if (cached) {
      return { data: cached, error: null }
    }

    let query = supabase
      .from('subcategories')
      .select(`
        id,
        category_id,
        name,
        slug,
        description,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching public subcategories:', error.message)
      }
      return { data: null, error }
    }

    const result = data || []
    setCache(cacheKey, result)
    return { data: result, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in fetchPublicSubcategories:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch subcategories for a specific category.
 *
 * @param {string} categoryId
 * @param {boolean} [publicOnly=true]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchSubcategoriesByCategory(categoryId, publicOnly = true) {
  if (!categoryId) return { data: [], error: null }
  return publicOnly
    ? fetchPublicSubcategories(categoryId)
    : fetchSubcategories(categoryId)
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN MUTATIONS — CREATE / UPDATE / DELETE / TOGGLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new subcategory under a main category.
 *
 * @param {Object} subcategory
 * @param {string} subcategory.category_id - UUID of parent category
 * @param {string} subcategory.name
 * @param {string} [subcategory.slug]
 * @param {string} [subcategory.description]
 * @param {boolean} [subcategory.is_active=true]
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createSubcategory({
  category_id,
  name,
  slug,
  description,
  is_active = true,
}) {
  try {
    if (!category_id) {
      return { data: null, error: new Error('Parent category is required.') }
    }
    if (!name || !name.trim()) {
      return { data: null, error: new Error('Subcategory name is required.') }
    }

    const cleanSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(name)

    const payload = {
      category_id,
      name: name.trim(),
      slug: cleanSlug,
      description: description?.trim() || null,
      is_active: is_active !== false,
    }

    const { data, error } = await supabase
      .from('subcategories')
      .insert([payload])
      .select(`
        id,
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating subcategory:', error.message)
      }
      return { data: null, error }
    }

    invalidateCache('public_subcategories')

    return { data: { ...data, product_count: 0 }, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in createSubcategory:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Update an existing subcategory by ID.
 *
 * @param {string} id - Subcategory UUID
 * @param {Object} fields - Fields to update
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateSubcategory(id, fields) {
  try {
    if (!id) return { data: null, error: new Error('Subcategory ID is required.') }

    const payload = {}

    if (fields.name !== undefined) {
      payload.name = fields.name.trim()
      payload.slug = fields.slug ? generateSlug(fields.slug) : generateSlug(fields.name)
    } else if (fields.slug !== undefined) {
      payload.slug = generateSlug(fields.slug)
    }

    if (fields.description !== undefined) {
      payload.description = fields.description?.trim() || null
    }

    if (fields.is_active !== undefined) {
      payload.is_active = Boolean(fields.is_active)
    }

    if (fields.category_id !== undefined) {
      payload.category_id = fields.category_id
    }

    const { data, error } = await supabase
      .from('subcategories')
      .update(payload)
      .eq('id', id)
      .select(`
        id,
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error updating subcategory (${id}):`, error.message)
      }
      return { data: null, error }
    }

    invalidateCache('public_subcategories')

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in updateSubcategory (${id}):`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Delete a subcategory if no products are assigned.
 *
 * @param {string} id - Subcategory UUID
 * @returns {Promise<{ success: boolean, productCount: number, error: Error|null }>}
 */
export async function deleteSubcategory(id) {
  try {
    if (!id) return { success: false, productCount: 0, error: new Error('Subcategory ID is required.') }

    // Check if products reference this subcategory
    const { count, error: countErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('subcategory_id', id)

    if (countErr) {
      return { success: false, productCount: 0, error: countErr }
    }

    if (count > 0) {
      return {
        success: false,
        productCount: count,
        error: new Error(
          `This subcategory is used by ${count} product${count === 1 ? '' : 's'}. Reassign or unassign those products before removing this subcategory.`
        ),
      }
    }

    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id)

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error deleting subcategory (${id}):`, error.message)
      }
      return { success: false, productCount: 0, error }
    }

    invalidateCache('public_subcategories')

    return { success: true, productCount: 0, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in deleteSubcategory (${id}):`, err)
    }
    return { success: false, productCount: 0, error: err }
  }
}

/**
 * Toggle a subcategory's active status.
 *
 * @param {string} id
 * @param {boolean} currentActive
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function toggleSubcategoryActive(id, currentActive) {
  return updateSubcategory(id, { is_active: !currentActive })
}
