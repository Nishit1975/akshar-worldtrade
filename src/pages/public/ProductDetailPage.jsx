import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Container from '../../components/ui/Container'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { getProductBySlug } from '../../services/products'
import { company, getWhatsAppUrl, getCanonicalUrl } from '../../config/company'
import { useQuoteModal } from '../../context/QuoteModalContext'

/**
 * Normalizes visible category labels without altering backend data or database slugs.
 * Specifically maps "Milling Products & Flours" to "Milling Flours".
 */
const normalizeCategoryLabel = (label) => {
  if (!label) return ''
  const trimmed = label.trim()
  if (
    trimmed.toLowerCase() === 'milling products & flours' ||
    trimmed.toLowerCase() === 'milling products and flours' ||
    trimmed.toLowerCase() === 'milling-products-flours'
  ) {
    return 'Milling Flours'
  }
  return trimmed
}

/** Image area with gallery support — clean placeholder if no image */
const ProductImageGallery = ({ mainImage, galleryImages = [], name, category }) => {
  const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean)
  const [selectedImage, setSelectedImage] = useState(null)

  // Derive active image cleanly without needing an effect
  const activeImage = selectedImage || allImages[0] || null

  return (
    <div className="space-y-4">
      {/* Main Active Image Frame */}
      <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-lg shadow-navy-950/5 flex items-center justify-center">
        {activeImage ? (
          <img
            src={activeImage}
            alt={name}
            className="w-full h-full object-cover object-center block transition-transform duration-700 ease-out"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <svg
              className="h-14 w-14 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="text-sm text-slate-400 font-medium">
              {category ? `${category} image coming soon` : 'Product image coming soon'}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails ONLY if multiple images exist in data */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" role="group" aria-label="Product image gallery thumbnails">
          {allImages.map((imgUrl, idx) => {
            const isSelected = activeImage === imgUrl
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                className={[
                  'h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all duration-150',
                  isSelected ? 'border-navy-600 ring-2 ring-navy-600/20 shadow-sm' : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100',
                ].join(' ')}
                aria-label={`View image ${idx + 1} of ${name}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Specification row */
const SpecRow = ({ label, value, isEven = false }) => {
  const displayValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)

  return (
    <tr className={[isEven ? 'bg-surface/50' : 'bg-white', 'border-b border-slate-100 last:border-0'].join(' ')}>
      <th className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-left text-xs sm:text-sm font-semibold text-navy-900 w-2/5 sm:w-1/3 align-top break-words">
        {label}
      </th>
      <td className="py-2.5 sm:py-3 px-3.5 sm:px-4 text-xs sm:text-sm text-slate-700 break-words">{displayValue}</td>
    </tr>
  )
}

const ProductDetailPage = () => {
  const { slug } = useParams()
  const { openQuoteModal } = useQuoteModal()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function fetchDetail() {
      if (!slug) return

      try {
        const { data, error: fetchErr } = await getProductBySlug(slug)

        if (!isMounted) return

        if (fetchErr) {
          setError(fetchErr.message || 'Failed to load product details')
        } else {
          setProduct(data || null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading product information.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDetail()

    return () => {
      isMounted = false
    }
  }, [slug, retryCount])

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="navy" label="Loading product details…" />
        <p className="text-sm text-slate-500 font-medium">Loading product information…</p>
      </div>
    )
  }

  // ── Error or Not Found state ────────────────────────────────
  if (error || !product) {
    return (
      <div className="py-24">
        <EmptyState
          icon={
            <svg className="h-16 w-16 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title={error ? 'Unable to load product' : 'Product not found'}
          description={
            error ||
            `No published product found for "${slug}". It may have been removed or the URL may be incorrect.`
          }
          action={
            <div className="flex gap-3 justify-center">
              {error ? (
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true)
                    setError(null)
                    setRetryCount((c) => c + 1)
                  }}
                  className="inline-flex items-center px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Try Again
                </button>
              ) : null}
              <Link
                to="/products"
                className="inline-flex items-center px-5 py-2.5 border border-navy-200 text-navy-700 hover:bg-navy-50 text-sm font-semibold rounded-lg transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  // Normalize data fields from Supabase
  const name = product.name || ''
  const rawCategory = product.categories?.name || product.category || ''
  const category = normalizeCategoryLabel(rawCategory)
  const subcategory = product.subcategories?.name || product.subcategory || ''
  const shortDescription = product.short_description || product.shortDescription || ''
  const fullDescription = product.full_description || product.fullDescription || ''
  const mainImage = product.main_image || product.image || null
  const galleryImages = product.gallery_images || []
  const specifications = product.specifications || {}
  const packaging = product.packaging || ''
  const moq = product.moq || ''
  const origin = product.origin || ''

  // Specifications validation: render ONLY when real specifications data exists
  const hasSpecifications =
    specifications &&
    typeof specifications === 'object' &&
    Object.keys(specifications).length > 0 &&
    Object.values(specifications).some((val) => val !== null && val !== undefined && String(val).trim() !== '')

  const canonicalUrl = slug ? getCanonicalUrl(`/products/${slug}`) : null
  const pageDescription =
    shortDescription ||
    fullDescription ||
    `High-quality ${name} exported from India by Akshar Worldtrade. Sourcing, custom packaging, and international export documentation for global B2B buyers.`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: pageDescription,
    image: mainImage || undefined,
    category: category || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Akshar Worldtrade',
    },
  }

  return (
    <>
      <Helmet>
        <title>{name} | Akshar Worldtrade</title>
        <meta name="description" content={pageDescription} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content={`${name} | Akshar Worldtrade`} />
        <meta property="og:description" content={pageDescription} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="product" />
        {mainImage && <meta property="og:image" content={mainImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name} | Akshar Worldtrade`} />
        <meta name="twitter:description" content={pageDescription} />
        {mainImage && <meta name="twitter:image" content={mainImage} />}
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {/* ── Breadcrumb Navigation ─────────────────────────────────── */}
      <div className="bg-surface border-b border-gray-100">
        <Container>
          <nav className="flex items-center gap-2 py-3 text-xs text-slate-500 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-navy-700 transition-colors flex-shrink-0">
              Home
            </Link>
            <span aria-hidden="true" className="text-slate-300 flex-shrink-0">/</span>
            <Link to="/products" className="hover:text-navy-700 transition-colors flex-shrink-0">
              Products
            </Link>
            {category && (
              <>
                <span aria-hidden="true" className="text-slate-300 flex-shrink-0">/</span>
                <Link
                  to={`/products?category=${encodeURIComponent(product.categories?.slug || product.categories?.id || category)}`}
                  className="hover:text-navy-700 transition-colors flex-shrink-0"
                >
                  {category}
                </Link>
              </>
            )}
            <span aria-hidden="true" className="text-slate-300 flex-shrink-0">/</span>
            <span className="text-navy-900 font-semibold truncate max-w-xs">{name}</span>
          </nav>
        </Container>
      </div>

      {/* ── Main Product Showcase ─────────────────────────────────── */}
      <section className="bg-white py-6 sm:py-8 lg:py-10 border-b border-gray-100/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start">

            {/* Left Column: Large Product Image Frame */}
            <div className="lg:col-span-6 xl:col-span-6">
              <ProductImageGallery
                mainImage={mainImage}
                galleryImages={galleryImages}
                name={name}
                category={category}
              />
            </div>

            {/* Right Column: Product Information */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              {/* Category & Subcategory Badges */}
              {(category || subcategory) && (
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  {category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-navy-800 bg-navy-50/90 border border-navy-100 px-3 py-1 rounded-full shadow-2xs">
                      {category}
                    </span>
                  )}
                  {subcategory && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full">
                      {subcategory}
                    </span>
                  )}
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-[1.65rem] sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-extrabold text-navy-900 leading-[1.2] tracking-tight mb-2 sm:mb-3">
                {name}
              </h1>

              {/* Short Description */}
              {shortDescription && (
                <p className="text-[15px] sm:text-base text-slate-600 leading-relaxed mb-3.5 sm:mb-4">
                  {shortDescription}
                </p>
              )}

              {/* Gold Accent Divider */}
              <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-3.5 sm:mb-4" aria-hidden="true" />

              {/* Product Summary Information (MOQ & Origin Cards) */}
              {(moq || origin) && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3.5 mb-4 sm:mb-5">
                  {moq && (
                    <div className="bg-surface/80 rounded-xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs">
                      <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
                        <span className="truncate">Min. Order Qty</span>
                      </p>
                      <p className="text-sm sm:text-base font-bold text-navy-900 break-words">
                        {moq}
                      </p>
                    </div>
                  )}
                  {origin && (
                    <div className="bg-surface/80 rounded-xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs">
                      <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
                        <span className="truncate">Origin</span>
                      </p>
                      <p className="text-sm sm:text-base font-bold text-navy-900 break-words">
                        {origin}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => openQuoteModal(name)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2 min-h-[44px] cursor-pointer"
                >
                  <span>Request a Quote</span>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </button>
                {company.whatsapp && getWhatsAppUrl(company.whatsapp) ? (
                  <a
                    href={getWhatsAppUrl(company.whatsapp, `Hello Akshar Worldtrade, I am interested in ${name}. Please share details.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[46px]"
                  >
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp Inquiry</span>
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-navy-50/80 text-navy-800 text-sm font-semibold rounded-xl border border-navy-200 hover:border-navy-300 shadow-2xs transition-all duration-200 min-h-[46px]"
                  >
                    <span>Contact Trade Desk</span>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── Product Description & Details Section ─────────────────── */}
      <section className="bg-surface/50 py-6 sm:py-7 lg:py-9">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-start">

            {/* Left Column: Product Description & Technical Specifications */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              {fullDescription && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-2xs">
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-gold-600 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                    <span>Product Overview</span>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy-900 leading-snug mb-2">
                    Product Description
                  </h2>
                  <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-3.5 sm:mb-4" aria-hidden="true" />
                  <div className="space-y-3.5 text-slate-700 leading-relaxed text-sm sm:text-base">
                    {fullDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Technical Specifications ONLY if real specification data exists */}
              {hasSpecifications && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-2xs">
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-gold-600 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                    <span>Quality Benchmarks</span>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy-900 leading-snug mb-2">
                    Technical Specifications
                  </h2>
                  <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-3.5 sm:mb-4" aria-hidden="true" />
                  <div className="overflow-hidden rounded-xl border border-slate-200/70">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {Object.entries(specifications).map(([label, value], idx) => (
                          <SpecRow key={label} label={label} value={value} isEven={idx % 2 === 0} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Details Sidebar & Compact Inquiry CTA */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 sm:space-y-4">
              {packaging && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-900">
                      Export Packaging
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed pl-4">
                    {packaging}
                  </p>
                </div>
              )}

              {/* Compact B2B Inquiry CTA */}
              <div className="relative overflow-hidden bg-navy-900 rounded-2xl p-4 sm:p-6 text-white shadow-md border border-navy-800">
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"
                  aria-hidden="true"
                />
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-navy-800 border border-gold-500/30 text-gold-400 text-2xs font-bold tracking-widest uppercase mb-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                  <span>Export Inquiry</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">
                  Interested in this product?
                </h3>
                <p className="text-sm text-navy-100/90 leading-relaxed mb-4">
                  Contact us to discuss pricing, availability, and shipping options for your requirement.
                </p>
                <button
                  type="button"
                  onClick={() => openQuoteModal(name)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 min-h-[44px] cursor-pointer"
                >
                  <span>Request a Quote</span>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </Container>
      </section>
    </>
  )
}

export default ProductDetailPage
