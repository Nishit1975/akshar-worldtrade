import { supabase } from './supabase'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Validate image file before uploading.
 *
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Allowed formats: JPG, PNG, WEBP.`,
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5 MB.`,
    }
  }

  return { valid: true, error: null }
}

/**
 * Generate a safe unique filename preserving file extension.
 *
 * @param {string} originalName
 * @returns {string}
 */
function generateSafeFilename(originalName) {
  const ext = originalName.split('.').pop().toLowerCase()
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomStr}.${ext}`
}

/**
 * Get public URL for a storage path in product-images bucket.
 *
 * @param {string} path
 * @returns {string}
 */
export function getPublicImageUrl(path) {
  if (!path) return ''
  // If it's already a full HTTP/HTTPS URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data?.publicUrl || ''
}

/**
 * Extract storage object path from a Supabase public URL or relative path.
 *
 * @param {string} urlOrPath
 * @returns {string}
 */
export function extractStoragePath(urlOrPath) {
  if (!urlOrPath) return ''
  const prefix = `/storage/v1/object/public/${BUCKET_NAME}/`
  const index = urlOrPath.indexOf(prefix)
  if (index !== -1) {
    return decodeURIComponent(urlOrPath.substring(index + prefix.length))
  }
  return urlOrPath
}

/**
 * Upload main product image to Supabase Storage.
 * Organized as: product-images/<productId>/main/<unique-name>
 *
 * @param {File} file - Raw File object from input
 * @param {string} productId - UUID of the product
 * @returns {Promise<{ data: { publicUrl: string, path: string }|null, error: Error|null }>}
 */
export async function uploadProductImage(file, productId) {
  try {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    if (!productId) {
      return { data: null, error: new Error('Product ID is required for storage organization') }
    }

    const filename = generateSafeFilename(file.name)
    const filePath = `${productId}/main/${filename}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      if (import.meta.env.DEV) {
        console.error('Storage uploadProductImage error:', uploadError.message)
      }
      return { data: null, error: uploadError }
    }

    const publicUrl = getPublicImageUrl(filePath)
    return { data: { publicUrl, path: filePath }, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in uploadProductImage:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Upload a gallery image to Supabase Storage.
 * Organized as: product-images/<productId>/gallery/<unique-name>
 *
 * @param {File} file - Raw File object
 * @param {string} productId - UUID of the product
 * @returns {Promise<{ data: { publicUrl: string, path: string }|null, error: Error|null }>}
 */
export async function uploadProductGalleryImage(file, productId) {
  try {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    if (!productId) {
      return { data: null, error: new Error('Product ID is required for storage organization') }
    }

    const filename = generateSafeFilename(file.name)
    const filePath = `${productId}/gallery/${filename}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      if (import.meta.env.DEV) {
        console.error('Storage uploadProductGalleryImage error:', uploadError.message)
      }
      return { data: null, error: uploadError }
    }

    const publicUrl = getPublicImageUrl(filePath)
    return { data: { publicUrl, path: filePath }, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in uploadProductGalleryImage:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Delete a product image from Supabase Storage by path or public URL.
 *
 * @param {string} pathOrUrl
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteProductImage(pathOrUrl) {
  try {
    if (!pathOrUrl) return { success: true, error: null }
    const path = extractStoragePath(pathOrUrl)
    if (!path) return { success: true, error: null }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error deleting image ${path}:`, error.message)
      }
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in deleteProductImage:', err)
    }
    return { success: false, error: err }
  }
}

/**
 * Clean up all images belonging to a product folder (main + gallery).
 *
 * @param {string} productId
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteProductFolder(productId) {
  if (!productId) return { success: true, error: null }

  try {
    // List files in main and gallery directories
    const [mainList, galleryList] = await Promise.all([
      supabase.storage.from(BUCKET_NAME).list(`${productId}/main`),
      supabase.storage.from(BUCKET_NAME).list(`${productId}/gallery`),
    ])

    const filesToRemove = []

    if (mainList.data && mainList.data.length > 0) {
      mainList.data.forEach((item) => {
        filesToRemove.push(`${productId}/main/${item.name}`)
      })
    }

    if (galleryList.data && galleryList.data.length > 0) {
      galleryList.data.forEach((item) => {
        filesToRemove.push(`${productId}/gallery/${item.name}`)
      })
    }

    if (filesToRemove.length > 0) {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToRemove)

      if (error && import.meta.env.DEV) {
        console.error(`Error removing product files for ${productId}:`, error.message)
      }
    }

    return { success: true, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error deleting product folder ${productId}:`, err)
    }
    return { success: false, error: err }
  }
}
