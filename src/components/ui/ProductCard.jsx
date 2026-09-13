import { Link } from 'react-router-dom'
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

/** Clean placeholder shown when product has no image */
const ImagePlaceholder = ({ category }) => (
  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2 p-4">
    <svg
      className="h-10 w-10 text-slate-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
    {category && (
      <span className="text-xs text-slate-400 font-medium text-center leading-tight">
        {category}
      </span>
    )}
  </div>
)

/**
 * ProductCard — modern B2B export catalogue card.
 *
 * @param {object} product - product data object
 * @param {string} className - additional CSS classes
 */
const ProductCard = ({ product, className = '' }) => {
  const { openQuoteModal } = useQuoteModal()
  if (!product) return null

  // Normalize fields between Supabase schema and legacy/fallback objects
  const name = product.name || ''
  const slug = product.slug || ''
  const rawCategory = product.categories?.name || product.category || ''
  const category = normalizeCategoryLabel(rawCategory)
  const subcategory = product.subcategories?.name || ''
  const shortDescription = product.short_description || product.shortDescription || ''
  const image = product.main_image || product.image || null
  const moq = product.moq || null

  return (
    <article
      className={[
        'group bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden',
        'transition-all duration-300 hover:shadow-md hover:border-navy-200 hover:-translate-y-1 flex flex-col h-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Product Image Frame */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <ImagePlaceholder category={category} />
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-5 justify-between">
        <div>
          {/* Category & Subcategory Badges */}
          {(category || subcategory) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {category && (
                <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-navy-800 bg-navy-50/90 px-2.5 py-0.5 rounded-md border border-navy-100">
                  {category}
                </span>
              )}
              {subcategory && (
                <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                  {subcategory}
                </span>
              )}
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-[15px] sm:text-base font-bold text-navy-900 group-hover:text-navy-700 transition-colors line-clamp-2 min-h-[2.5rem] mb-1 leading-snug">
            {name}
          </h3>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-2.5 sm:mb-3">
              {shortDescription}
            </p>
          )}
        </div>

        {/* Bottom Section: MOQ & Action Buttons */}
        <div className="pt-2 mt-auto">
          {moq ? (
            <div className="flex items-center gap-1.5 py-1 px-2 sm:py-1.5 sm:px-2.5 rounded-lg bg-surface border border-slate-100 text-xs text-slate-600 mb-2.5 sm:mb-3">
              <span className="font-bold text-navy-800 uppercase tracking-wider text-3xs">MOQ:</span>
              <span className="font-medium text-slate-700">{moq}</span>
            </div>
          ) : (
            <div className="h-1.5 sm:h-2" aria-hidden="true" />
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/products/${slug}`}
              className="flex-1 text-center py-2.5 px-2 text-xs sm:text-sm font-semibold text-navy-700 bg-white hover:bg-navy-50/80 border border-navy-200 hover:border-navy-300 rounded-lg shadow-2xs transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 min-h-[42px] sm:min-h-[38px] flex items-center justify-center"
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={() => openQuoteModal(name)}
              className="flex-1 text-center py-2.5 px-2 text-xs sm:text-sm font-semibold text-white bg-navy-600 hover:bg-navy-700 rounded-lg shadow-2xs hover:shadow-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 min-h-[42px] sm:min-h-[38px] flex items-center justify-center cursor-pointer"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
