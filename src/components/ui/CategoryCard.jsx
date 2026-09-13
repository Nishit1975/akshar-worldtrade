import { Link } from 'react-router-dom'
import Badge from './Badge'
import grainsCerealsImg from '../../assets/grains-cereals.webp'
import spicesSeasoningsImg from '../../assets/spices-seasonings.webp'
import millingFloursImg from '../../assets/Milling Flours.png'

/**
 * CategoryCard — Category showcase card used on the Home Page.
 * Entire card is clickable and navigates to /products?category=<slug_or_id>.
 *
 * @param {object} category - category data object with { id, name, slug, description, image, product_count }
 * @param {string} className - optional additional classes
 */

/** Clean fallback placeholder shown when category has no image */
const CategoryImagePlaceholder = ({ name }) => (
  <div className="w-full h-full bg-surface-2 flex flex-col items-center justify-center gap-2.5 p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center text-navy-600">
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>
    <span className="text-xs text-gray-500 font-medium leading-tight">
      {name || 'Product Category'}
    </span>
  </div>
)

const CategoryCard = ({ category, className = '' }) => {
  if (!category) return null

  const name = category.name || ''
  const slug = category.slug || category.id || ''
  const description = category.description || ''
  const productCount = category.product_count ?? 0

  const isSpices =
    slug === 'spices-seasonings' ||
    slug === 'spices' ||
    slug === 'spices-and-seasonings' ||
    name.toLowerCase() === 'spices & seasonings' ||
    name.toLowerCase() === 'spices and seasonings' ||
    name.toLowerCase() === 'spices'

  const isGrains =
    slug === 'grains-cereals' ||
    slug === 'grains' ||
    name.toLowerCase() === 'grains & cereals' ||
    name.toLowerCase() === 'grains and cereals'

  const isMilling =
    slug === 'milling-products-flours' ||
    slug === 'milling-flours' ||
    name.toLowerCase() === 'milling flours' ||
    name.toLowerCase() === 'milling products & flours' ||
    name.toLowerCase() === 'milling products and flours'

  const fallbackImage = isSpices
    ? spicesSeasoningsImg
    : isGrains
      ? grainsCerealsImg
      : isMilling
        ? millingFloursImg
        : null

  const image = category.image || fallbackImage

  // Category filter target URL
  const targetUrl = `/products?category=${encodeURIComponent(slug)}`

  return (
    <Link
      to={targetUrl}
      className={[
        'group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden',
        'transition-all duration-300 hover:shadow-lg hover:border-navy-300 hover:-translate-y-1 flex flex-col',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Explore ${name} products (${productCount} available)`}
    >
      {/* Category Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-surface-2">
        {image ? (
          <img
            src={image}
            alt={`${name} export commodities`}
            className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <CategoryImagePlaceholder name={name} />
        )}

        {/* Product Count Pill */}
        {productCount > 0 && (
          <div className="absolute top-3.5 right-3.5 shadow-sm">
            <Badge variant="navy" size="sm" className="bg-navy-900/90 text-white border border-white/20 backdrop-blur-md font-semibold px-2.5 py-1">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 lg:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-navy-600 transition-colors duration-150 mb-1.5 sm:mb-2 leading-snug">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-3 sm:mb-3.5">
            {description}
          </p>
        )}

        {/* Action link indicator */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-navy-600 group-hover:text-navy-800 transition-colors min-h-[38px]">
          <span className="group-hover:text-navy-900 transition-colors">Explore Category</span>
          <div className="w-8 h-8 rounded-full bg-navy-50 group-hover:bg-navy-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
            <svg
              className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
