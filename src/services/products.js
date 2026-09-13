import { supabase } from './supabase'
import { getCache, setCache, invalidateCache } from './cache'

/**
 * Common select query with category join (for detail views and admin).
 */
const PRODUCT_SELECT_FIELDS = `
  id,
  name,
  slug,
  short_description,
  full_description,
  category_id,
  subcategory_id,
  main_image,
  gallery_images,
  specifications,
  packaging,
  moq,
  origin,
  featured,
  status,
  created_at,
  updated_at,
  categories (
    id,
    name,
    slug
  ),
  subcategories (
    id,
    name,
    slug
  )
`

/**
 * Lean select query for product catalogue listings.
 * Omits full_description, heavy specifications JSONB, and gallery arrays.
 */
const PRODUCT_LISTING_FIELDS = `
  id,
  name,
  slug,
  short_description,
  category_id,
  subcategory_id,
  main_image,
  moq,
  featured,
  status,
  created_at,
  updated_at,
  categories (
    id,
    name,
    slug
  ),
  subcategories (
    id,
    name,
    slug
  )
`

/* ═══════════════════════════════════════════════════════════════
   PUBLIC PRODUCT SERVICES (RLS Enforces published only)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Fetch all published products with category information.
 * RLS enforces that only 'published' products are returned to public/anonymous users.
 * Uses lean listing fields and runtime caching for fast response.
 *
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function getPublishedProducts() {
  try {
    const cached = getCache('published_products')
    if (cached) {
      return { data: cached, error: null }
    }

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_LISTING_FIELDS)
      .eq('status', 'published')
      .order('created_at', { ascending: true })

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error in getPublishedProducts:', error.message)
      }
      return { data: null, error }
    }

    const sorted = (data || []).slice().sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime()
      const timeB = new Date(b.created_at || 0).getTime()
      return timeA - timeB
    })

    setCache('published_products', sorted)
    return { data: sorted, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in getPublishedProducts:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch featured published products for the homepage.
 *
 * @param {number} [limit=4]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT_FIELDS)
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error in getFeaturedProducts:', error.message)
      }
      return { data: null, error }
    }

    const sorted = (data || []).slice().sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime()
      const timeB = new Date(b.created_at || 0).getTime()
      return timeA - timeB
    })

    return { data: sorted, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in getFeaturedProducts:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch a single published product by its unique slug.
 *
 * @param {string} slug
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function getProductBySlug(slug) {
  try {
    if (!slug) return { data: null, error: new Error('Slug is required') }

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT_FIELDS)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in getProductBySlug for "${slug}":`, error.message)
      }
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in getProductBySlug for "${slug}":`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch published products by category ID.
 *
 * @param {string} categoryId
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function getProductsByCategory(categoryId) {
  try {
    if (!categoryId) return getPublishedProducts()

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT_FIELDS)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: true })

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in getProductsByCategory (${categoryId}):`, error.message)
      }
      return { data: null, error }
    }

    const sorted = (data || []).slice().sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime()
      const timeB = new Date(b.created_at || 0).getTime()
      return timeA - timeB
    })

    return { data: sorted, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in getProductsByCategory (${categoryId}):`, err)
    }
    return { data: null, error: err }
  }
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PRODUCT SERVICES (Protected by PostgreSQL RLS)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Fetch all products (both published and draft) for the Admin panel.
 * Supports search query, status filtering, category filtering, and ordering.
 *
 * @param {Object} [options]
 * @param {string} [options.search]
 * @param {string} [options.status] - 'all' | 'published' | 'draft'
 * @param {string} [options.categoryId]
 * @param {string} [options.subcategoryId]
 * @param {string} [options.sortBy='created_at']
 * @param {boolean} [options.ascending=true]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function getAdminProducts({
  search = '',
  status = 'all',
  categoryId = 'all',
  subcategoryId = 'all',
  sortBy = 'created_at',
  ascending = true,
} = {}) {
  try {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT_FIELDS)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    if (subcategoryId && subcategoryId !== 'all') {
      query = query.eq('subcategory_id', subcategoryId)
    }

    if (search && search.trim()) {
      // Supabase ilike on name or short_description
      query = query.ilike('name', `%${search.trim()}%`)
    }

    query = query.order(sortBy, { ascending })

    const { data, error } = await query

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error in getAdminProducts:', error.message)
      }
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in getAdminProducts:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch a single product by ID for admin editing (draft or published).
 *
 * @param {string} id - Product UUID
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function getAdminProductById(id) {
  try {
    if (!id) return { data: null, error: new Error('Product ID is required') }

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT_FIELDS)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in getAdminProductById for "${id}":`, error.message)
      }
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in getAdminProductById for "${id}":`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Check if a product slug is already taken (excluding a specific product ID if updating).
 *
 * @param {string} slug
 * @param {string|null} [excludeId=null]
 * @returns {Promise<{ isUnique: boolean, error: Error|null }>}
 */
export async function checkSlugUnique(slug, excludeId = null) {
  try {
    if (!slug) return { isUnique: false, error: new Error('Slug is required') }

    let query = supabase
      .from('products')
      .select('id')
      .eq('slug', slug.trim())

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      return { isUnique: false, error }
    }

    return { isUnique: !data || data.length === 0, error: null }
  } catch (err) {
    return { isUnique: false, error: err }
  }
}

/**
 * Insert a new product into public.products.
 *
 * @param {Object} product
 * @param {string} [product.id] - Optional client generated UUID
 * @param {string} product.name
 * @param {string} product.slug
 * @param {string} [product.short_description]
 * @param {string} [product.full_description]
 * @param {string|null} [product.category_id]
 * @param {string|null} [product.main_image]
 * @param {string[]} [product.gallery_images]
 * @param {Object} [product.specifications]
 * @param {string} [product.packaging]
 * @param {string} [product.moq]
 * @param {string} [product.origin]
 * @param {boolean} [product.featured=false]
 * @param {'published'|'draft'} [product.status='draft']
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function createProduct(product) {
  try {
    const payload = {
      name: product.name?.trim(),
      slug: product.slug?.trim().toLowerCase(),
      short_description: product.short_description?.trim() || null,
      full_description: product.full_description?.trim() || null,
      category_id: product.category_id || null,
      subcategory_id: product.subcategory_id || null,
      main_image: product.main_image || null,
      gallery_images: Array.isArray(product.gallery_images) ? product.gallery_images : [],
      specifications: product.specifications && typeof product.specifications === 'object' ? product.specifications : {},
      packaging: product.packaging?.trim() || null,
      moq: product.moq?.trim() || null,
      origin: product.origin?.trim() || null,
      featured: Boolean(product.featured),
      status: product.status === 'published' ? 'published' : 'draft',
    }

    if (product.id) {
      payload.id = product.id
    }

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select(PRODUCT_SELECT_FIELDS)
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error in createProduct:', error.message)
      }
      return { data: null, error }
    }

    invalidateCache('published_products')
    invalidateCache('showcase_categories')

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in createProduct:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Update an existing product by ID.
 *
 * @param {string} id - Product UUID
 * @param {Object} product - Product fields to update
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateProduct(id, product) {
  try {
    if (!id) return { data: null, error: new Error('Product ID is required') }

    const payload = {}

    if (product.name !== undefined) payload.name = product.name?.trim()
    if (product.slug !== undefined) payload.slug = product.slug?.trim().toLowerCase()
    if (product.short_description !== undefined) payload.short_description = product.short_description?.trim() || null
    if (product.full_description !== undefined) payload.full_description = product.full_description?.trim() || null
    if (product.category_id !== undefined) payload.category_id = product.category_id || null
    if (product.subcategory_id !== undefined) payload.subcategory_id = product.subcategory_id || null
    if (product.main_image !== undefined) payload.main_image = product.main_image || null
    if (product.gallery_images !== undefined) payload.gallery_images = Array.isArray(product.gallery_images) ? product.gallery_images : []
    if (product.specifications !== undefined) payload.specifications = product.specifications && typeof product.specifications === 'object' ? product.specifications : {}
    if (product.packaging !== undefined) payload.packaging = product.packaging?.trim() || null
    if (product.moq !== undefined) payload.moq = product.moq?.trim() || null
    if (product.origin !== undefined) payload.origin = product.origin?.trim() || null
    if (product.featured !== undefined) payload.featured = Boolean(product.featured)
    if (product.status !== undefined) payload.status = product.status === 'published' ? 'published' : 'draft'

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select(PRODUCT_SELECT_FIELDS)
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in updateProduct (${id}):`, error.message)
      }
      return { data: null, error }
    }

    invalidateCache('published_products')
    invalidateCache('showcase_categories')

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in updateProduct (${id}):`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Delete a product by ID.
 *
 * @param {string} id - Product UUID
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteProduct(id) {
  try {
    if (!id) return { success: false, error: new Error('Product ID is required') }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in deleteProduct (${id}):`, error.message)
      }
      return { success: false, error }
    }

    invalidateCache('published_products')
    invalidateCache('showcase_categories')

    return { success: true, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in deleteProduct (${id}):`, err)
    }
    return { success: false, error: err }
  }
}

/**
 * Toggle product status between 'published' and 'draft'.
 *
 * @param {string} id
 * @param {'published'|'draft'} currentStatus
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function toggleProductStatus(id, currentStatus) {
  const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
  return updateProduct(id, { status: nextStatus })
}

/**
 * Toggle product featured flag.
 *
 * @param {string} id
 * @param {boolean} currentFeatured
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function toggleProductFeatured(id, currentFeatured) {
  return updateProduct(id, { featured: !currentFeatured })
}

/**
 * Fetch real database metrics for the admin dashboard.
 *
 * @returns {Promise<{
 *   data: {
 *     totalProducts: number,
 *     publishedProducts: number,
 *     draftProducts: number,
 *     featuredProducts: number,
 *     newEnquiries: number,
 *     totalEnquiries: number,
 *     recentProducts: Array
 *   }|null,
 *   error: Error|null
 * }>}
 */
export async function getAdminDashboardStats() {
  try {
    const [
      totalRes,
      publishedRes,
      draftRes,
      featuredRes,
      newEnquiriesRes,
      totalEnquiriesRes,
      recentRes,
      recentEnquiriesRes,
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('products').select(PRODUCT_SELECT_FIELDS).order('created_at', { ascending: false }).limit(5),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(4),
    ])

    const error =
      totalRes.error ||
      publishedRes.error ||
      draftRes.error ||
      featuredRes.error ||
      newEnquiriesRes.error ||
      totalEnquiriesRes.error ||
      recentRes.error ||
      recentEnquiriesRes.error

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching admin dashboard stats:', error.message)
      }
      return { data: null, error }
    }

    return {
      data: {
        totalProducts: totalRes.count || 0,
        publishedProducts: publishedRes.count || 0,
        draftProducts: draftRes.count || 0,
        featuredProducts: featuredRes.count || 0,
        newEnquiries: newEnquiriesRes.count || 0,
        totalEnquiries: totalEnquiriesRes.count || 0,
        recentProducts: recentRes.data || [],
        recentEnquiries: recentEnquiriesRes.data || [],
      },
      error: null,
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in getAdminDashboardStats:', err)
    }
    return { data: null, error: err }
  }
}

// Aliases for compatibility
export const fetchPublishedProducts = getPublishedProducts
export const fetchFeaturedProducts = getFeaturedProducts
export const fetchProductBySlug = getProductBySlug
