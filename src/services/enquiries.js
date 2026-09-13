import { supabase } from './supabase'

/**
 * Submit a buyer enquiry / quotation request to Supabase.
 * Public insert permitted by RLS.
 *
 * @param {Object} enquiryData
 * @param {string} enquiryData.name
 * @param {string} [enquiryData.company_name]
 * @param {string} [enquiryData.country]
 * @param {string} enquiryData.email
 * @param {string} [enquiryData.phone]
 * @param {string} [enquiryData.product]
 * @param {string} [enquiryData.quantity]
 * @param {string} [enquiryData.message]
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function submitEnquiry(enquiryData) {
  try {
    const payload = {
      name: enquiryData.name?.trim(),
      company_name: enquiryData.company_name?.trim() || null,
      country: enquiryData.country?.trim() || null,
      email: enquiryData.email?.trim(),
      phone: enquiryData.phone?.trim() || null,
      product: enquiryData.product?.trim() || null,
      quantity: enquiryData.quantity?.trim() || null,
      message: enquiryData.message?.trim() || null,
      status: 'new',
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert([payload])
      .select()
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting enquiry:', error.message)
      }
      return { data: null, error }
    }

    // 2. Trigger secure server-side email notifications via Supabase Edge Function
    // Non-blocking: failure to send email must NEVER fail or rollback the enquiry submission
    if (data?.id) {
      supabase.functions
        .invoke('send-enquiry-emails', {
          body: {
            enquiryId: data.id,
            enquiry: {
              id: data.id,
              name: data.name,
              company_name: data.company_name,
              country: data.country,
              email: data.email,
              phone: data.phone,
              product: data.product,
              quantity: data.quantity,
              message: data.message,
              created_at: data.created_at,
            },
          },
        })
        .then(({ data: fnData, error: fnErr }) => {
          if (import.meta.env.DEV) {
            if (fnErr) {
              console.warn('Edge Function email notification warning:', fnErr.message)
            } else {
              console.log('Enquiry email notifications triggered:', fnData)
            }
          }
        })
        .catch((err) => {
          if (import.meta.env.DEV) {
            console.warn('Edge Function email invoke caught error:', err)
          }
        })
    }

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in submitEnquiry:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch all enquiries for the Admin panel with filtering and sorting.
 * Admin only — RLS enforces public.is_admin() check.
 *
 * @param {Object} [options]
 * @param {string} [options.search]
 * @param {string} [options.status] - 'all' | 'new' | 'read' | 'replied'
 * @param {string} [options.product] - Filter by specific product
 * @param {string} [options.sortBy='created_at']
 * @param {boolean} [options.ascending=false]
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function getAdminEnquiries({
  search = '',
  status = 'all',
  product = 'all',
  sortBy = 'created_at',
  ascending = false,
} = {}) {
  try {
    let query = supabase.from('enquiries').select('*')

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (product && product !== 'all') {
      query = query.eq('product', product)
    }

    if (search && search.trim()) {
      const q = search.trim()
      // Supabase or filter across name, email, company_name, product
      query = query.or(
        `name.ilike.%${q}%,email.ilike.%${q}%,company_name.ilike.%${q}%,product.ilike.%${q}%,country.ilike.%${q}%`,
      )
    }

    query = query.order(sortBy, { ascending })

    const { data, error } = await query

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error in getAdminEnquiries:', error.message)
      }
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in getAdminEnquiries:', err)
    }
    return { data: null, error: err }
  }
}

/**
 * Fetch a single enquiry by its UUID.
 *
 * @param {string} id
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function getEnquiryById(id) {
  try {
    if (!id) return { data: null, error: new Error('Enquiry ID is required') }

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in getEnquiryById (${id}):`, error.message)
      }
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in getEnquiryById (${id}):`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Update enquiry status.
 *
 * @param {string} id
 * @param {'new'|'read'|'replied'} status
 * @returns {Promise<{ data: Object|null, error: Error|null }>}
 */
export async function updateEnquiryStatus(id, status) {
  try {
    if (!id) return { data: null, error: new Error('Enquiry ID is required') }

    const validStatuses = ['new', 'read', 'replied']
    if (!validStatuses.includes(status)) {
      return {
        data: null,
        error: new Error(`Invalid status "${status}". Allowed: new, read, replied`),
      }
    }

    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error updating enquiry status (${id}):`, error.message)
      }
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in updateEnquiryStatus (${id}):`, err)
    }
    return { data: null, error: err }
  }
}

/**
 * Delete an enquiry permanently from database.
 *
 * @param {string} id
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteEnquiry(id) {
  try {
    if (!id) return { success: false, error: new Error('Enquiry ID is required') }

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id)

    if (error) {
      if (import.meta.env.DEV) {
        console.error(`Error deleting enquiry (${id}):`, error.message)
      }
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(`Unexpected error in deleteEnquiry (${id}):`, err)
    }
    return { success: false, error: err }
  }
}

/**
 * Get count of unread / new enquiries.
 *
 * @returns {Promise<{ count: number, error: Error|null }>}
 */
export async function getNewEnquiryCount() {
  try {
    const { count, error } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    if (error) {
      return { count: 0, error }
    }

    return { count: count || 0, error: null }
  } catch (err) {
    return { count: 0, error: err }
  }
}

// Aliases for compatibility
export const fetchEnquiriesAdmin = getAdminEnquiries
export const updateEnquiryStatusAdmin = updateEnquiryStatus
