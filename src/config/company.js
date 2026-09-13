/**
 * Company Profile & Contact Configuration
 *
 * Central source of truth for Akshar Worldtrade public company info,
 * communication channels, and business contact points.
 */
export const company = {
  name: 'Akshar Worldtrade',
  tagline: 'Connecting India with the World',
  subtitle: 'Import | Export | Global Trade',
  description:
    'AKSHAR WORLDTRADE connects global buyers with quality Indian products. Reliable sourcing, professional documentation, and competitive pricing for B2B trade worldwide.',
  email: 'aksharworldtrade@gmail.com',
  phone: '+91 63538 55938',
  whatsapp: '916353855938',
  social: {
    instagram: 'https://www.instagram.com/aksharworldtrade/',
    facebook: 'https://www.facebook.com/profile.php?id=61593835794836',
    linkedin: 'https://www.linkedin.com/company/144674966/',
  },
  siteUrl: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://aksharworldtrade.com',
  address: {
    street: '',
    city: 'Rajkot',
    state: 'Gujarat',
    country: 'India',
    formatted: 'Rajkot, Gujarat, India',
  },
  businessHours: {
    schedule: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    weekdays: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    saturday: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    sunday: 'Sunday: Closed',
    formatted: 'Monday – Saturday: 10:00 AM – 7:00 PM IST | Sunday: Closed',
    note: '* Hours subject to change on Indian public holidays.',
  },
  exportMarkets: [
    'UAE',
    'South Africa',
    'China',
    'Bangladesh',
    'Saudi Arabia',
    'Iran',
    'Malaysia',
    'Other International Markets',
  ],
}

/**
 * Helper to build clean WhatsApp click-to-chat links
 * @param {string} phoneDigits - Phone number in international format without + (e.g. 916353855938)
 * @param {string} [customMessage] - Optional pre-filled message text
 * @returns {string|null} Full wa.me link or null if phone is empty/invalid
 */
export function getWhatsAppUrl(phoneDigits = company.whatsapp, customMessage = '') {
  if (!phoneDigits) return null
  const cleaned = String(phoneDigits).replace(/[^0-9]/g, '')
  if (cleaned.length < 7) return null
  const textParam = customMessage ? `?text=${encodeURIComponent(customMessage)}` : ''
  return `https://wa.me/${cleaned}${textParam}`
}

/**
 * Helper to generate canonical URLs dynamically when siteUrl is defined
 * @param {string} path - Route path (e.g. '/products/basmati-rice')
 * @returns {string|null} Full canonical URL or null if siteUrl is not yet set
 */
export function getCanonicalUrl(path = '/') {
  if (!company.siteUrl) return null
  const base = company.siteUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}
