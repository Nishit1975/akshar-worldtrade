import { supabase } from './supabase'
import grainsCerealsImg from '../assets/grains-cereals.webp'
import spicesSeasoningsImg from '../assets/spices-seasonings.webp'
import millingFloursImg from '../assets/Milling Flours.png'
import { getCache, setCache, invalidateCache } from './cache'

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a text string.
 * @param {string} text
 * @returns {string}
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

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — ALL CATEGORIES (active + inactive) WITH PRODUCT COUNT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch ALL categories for admin use, including inactive ones.
 * Includes a `product_count` field counting all products (any status)
 * assigned to each category.
 *
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        products(count)
      `)
      .order('name', { ascending: true })

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching categories:', error.message)
      }
      return { data: null, error }
    }

    // Flatten products count from nested join result
    const normalised = (data || []).map((cat) => ({
      ...cat,
      product_count: cat.products?.[0]?.count ?? 0,
    }))

    return { data: normalised, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in fetchCategories:', err)
    }
    return { data: null, error: err }
  }
}

// Convenient alias (used in AdminProductsPage, ProductForm, etc.)
export const getCategories = fetchCategories

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — ACTIVE CATEGORIES THAT HAVE PUBLISHED PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch categories that are:
 *   1. is_active = true
 *   2. Have at least one published product assigned.
 *
 * Used on the public Products page to drive the category filter tabs.
 * Queries active categories and product count in a single roundtrip,
 * utilizing runtime in-memory caching to avoid repeat fetches.
 *
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchPublicCategories() {
  try {
    const cached = getCache('public_categories')
    if (cached) {
      return { data: cached, error: null }
    }

    // Fetch active categories with product counts in a single query
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        products(count)
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (catErr) {
      if (import.meta.env.DEV) {
        console.error('Error fetching public categories:', catErr.message)
      }
      return { data: null, error: catErr }
    }

    if (!cats || cats.length === 0) {
      return { data: [], error: null }
    }

    // Filter categories that have at least one product
    const formatCategory = (cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    })

    const filtered = cats
      .filter((cat) => (cat.products?.[0]?.count ?? 0) > 0)
      .map(formatCategory)

    const result = filtered.length > 0 ? filtered : cats.map(formatCategory)

    setCache('public_categories', result)
    return { data: result, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in fetchPublicCategories:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Natural category descriptions for standard commodity sectors when
 * database description is not yet provided by admin.
 */
const DEFAULT_CATEGORY_DESCRIPTIONS = {
  'grains-cereals': "Premium export-grade grains, basmati rice, wheat, and cereals harvested from India's finest agricultural regions.",
  'grains': "Premium export-grade grains, basmati rice, wheat, and cereals harvested from India's finest agricultural regions.",
  'spices-seasonings': "Authentic Indian spices sourced directly from origin, cleaned, graded, and packed to global export standards.",
  'spices-and-seasonings': "Authentic Indian spices sourced directly from origin, cleaned, graded, and packed to global export standards.",
  'spices': "Authentic Indian spices sourced directly from origin, cleaned, graded, and packed to global export standards.",
  'pulses': "High-protein, carefully sorted and polished Indian pulses and legumes for international food markets.",
  'seeds-oils': "Superior quality oilseeds and natural seeds processed for food, confectionery, and industrial use.",
  'oilseeds': "Superior quality oilseeds and natural seeds processed for food, confectionery, and industrial use.",
  'milling-products-flours': 'Quality Indian flours sourced for consistent texture, reliable food applications, and international export requirements.',
  'milling-flours': 'Quality Indian flours sourced for consistent texture, reliable food applications, and international export requirements.',
}

/**
 * Dedicated category asset images.
 * "Grains & Cereals" uses the dedicated asset in src/assets/grains-cereals.webp.
 * "Spices & Seasonings" uses the dedicated asset in src/assets/spices-seasonings.webp.
 * "Milling Products & Flours" uses the dedicated asset in src/assets/Milling Flours.png.
 */
const CATEGORY_ASSET_IMAGES = {
  'grains-cereals': grainsCerealsImg,
  'grains': grainsCerealsImg,
  'spices-seasonings': spicesSeasoningsImg,
  'spices-and-seasonings': spicesSeasoningsImg,
  'spices': spicesSeasoningsImg,
  'milling-products-flours': millingFloursImg,
  'milling-flours': millingFloursImg,
}

/**
 * Display name overrides for the Home Page category showcase.
 * Allows showing a friendlier name without changing the database record.
 */
const CATEGORY_DISPLAY_NAMES = {
  'milling-products-flours': 'Milling Flours',
  'milling-flours': 'Milling Flours',
}

/**
 * Fetch categories formatted specifically for the Home Page category showcase.
 * Returns active categories enriched with counts, dedicated images, and natural descriptions.
 * Uses a single request with product count relation and runtime caching,
 * avoiding the heavy and slow sequential fetch of all products.
 *
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchShowcaseCategories() {
  try {
    const cached = getCache('showcase_categories')
    if (cached) {
      return { data: cached, error: null }
    }

    // Fetch active categories with product counts in a single query
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        is_active,
        products(count)
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (catErr) {
      if (import.meta.env.DEV) {
        console.error('Error fetching showcase categories:', catErr.message)
      }
      return { data: null, error: catErr }
    }

    if (!cats || cats.length === 0) {
      return { data: [], error: null }
    }

    // Enrich categories with images, natural descriptions, and counts
    const showcaseCategories = cats.map((cat) => {
      const productCount = cat.products?.[0]?.count ?? 0

      const isSpices =
        cat.slug === 'spices-seasonings' ||
        cat.slug === 'spices' ||
        cat.slug === 'spices-and-seasonings' ||
        cat.name?.toLowerCase() === 'spices & seasonings' ||
        cat.name?.toLowerCase() === 'spices and seasonings' ||
        cat.name?.toLowerCase() === 'spices'

      const isGrains =
        cat.slug === 'grains-cereals' ||
        cat.slug === 'grains' ||
        cat.name?.toLowerCase() === 'grains & cereals' ||
        cat.name?.toLowerCase() === 'grains and cereals'

      const dedicatedImage =
        CATEGORY_ASSET_IMAGES[cat.slug] ||
        CATEGORY_ASSET_IMAGES[cat.slug?.toLowerCase()] ||
        (isSpices ? spicesSeasoningsImg : null) ||
        (isGrains ? grainsCerealsImg : null)

      const representativeImage = dedicatedImage || cat.image_url || cat.image || null

      const naturalDescription =
        cat.description?.trim() ||
        DEFAULT_CATEGORY_DESCRIPTIONS[cat.slug] ||
        DEFAULT_CATEGORY_DESCRIPTIONS[cat.slug?.toLowerCase()] ||
        `Export-quality ${cat.name.toLowerCase()} sourced and processed to meet international food and agricultural trade standards.`

      const displayName = CATEGORY_DISPLAY_NAMES[cat.slug] || CATEGORY_DISPLAY_NAMES[cat.slug?.toLowerCase()] || cat.name

      return {
        id: cat.id,
        slug: cat.slug,
        is_active: cat.is_active,
        name: displayName,
        product_count: productCount,
        image: representativeImage,
        description: naturalDescription,
      }
    })

    setCache('showcase_categories', showcaseCategories)
    return { data: showcaseCategories, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in fetchShowcaseCategories:', err)
    }
    return { data: null, error: err }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new category.
 *
 * @param {{ name: string, description?: string, is_active?: boolean }} payload
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createCategory(payload) {
  try {
    const slug = generateSlug(payload.name)

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: payload.name.trim(),
        slug,
        description: payload.description?.trim() || null,
        is_active: payload.is_active !== false, // default true
      })
      .select('id, name, slug, description, is_active, created_at, updated_at')
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating category:', error.message)
      }
      return { data: null, error }
    }

    invalidateCache('public_categories')
    invalidateCache('showcase_categories')

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in createCategory:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Update an existing category by ID.
 *
 * @param {string} id
 * @param {{ name?: string, description?: string, is_active?: boolean }} payload
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateCategory(id, payload) {
  try {
    const updates = {}

    if (payload.name !== undefined) {
      updates.name = payload.name.trim()
      updates.slug = generateSlug(payload.name)
    }
    if (payload.description !== undefined) {
      updates.description = payload.description?.trim() || null
    }
    if (payload.is_active !== undefined) {
      updates.is_active = payload.is_active
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select('id, name, slug, description, is_active, created_at, updated_at')
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating category:', error.message)
      }
      return { data: null, error }
    }

    invalidateCache('public_categories')
    invalidateCache('showcase_categories')

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in updateCategory:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Delete a category by ID.
 * Before deletion, checks whether any products are assigned to this category.
 * Returns an error with a user-friendly message if products exist.
 *
 * @param {string} id
 * @returns {Promise<{ success: boolean, productCount: number, error: Error|null }>}
 */
export async function deleteCategory(id) {
  try {
    // Safety check: count products using this category
    const { count, error: countErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (countErr) {
      if (import.meta.env.DEV) {
        console.error('Error counting products for category:', countErr.message)
      }
      return { success: false, productCount: 0, error: countErr }
    }

    if (count > 0) {
      return {
        success: false,
        productCount: count,
        error: new Error(
          `This category is used by ${count} product${count !== 1 ? 's' : ''}. Reassign or delete those products before removing this category.`
        ),
      }
    }

    const { error: delErr } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (delErr) {
      if (import.meta.env.DEV) {
        console.error('Error deleting category:', delErr.message)
      }
      return { success: false, productCount: 0, error: delErr }
    }

    invalidateCache('public_categories')
    invalidateCache('showcase_categories')

    return { success: true, productCount: 0, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in deleteCategory:', err)
    }
    return { success: false, productCount: 0, error: err }
  }
}

/**
 * Toggle the is_active status of a category.
 *
 * @param {string} id
 * @param {boolean} currentIsActive
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function toggleCategoryActive(id, currentIsActive) {
  return updateCategory(id, { is_active: !currentIsActive })
}
