import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import CategoryCard from '../ui/CategoryCard'
import { fetchShowcaseCategories } from '../../services/categories'
import grainsCerealsImg from '../../assets/grains-cereals.webp'
import spicesSeasoningsImg from '../../assets/spices-seasonings.webp'
import millingFloursImg from '../../assets/Milling Flours.png'

const INITIAL_SHOWCASE_CATEGORIES = [
  {
    id: 'grains-cereals',
    name: 'Grains & Cereals',
    slug: 'grains-cereals',
    description: "Premium export-grade grains, basmati rice, wheat, and cereals harvested from India's finest agricultural regions.",
    image: grainsCerealsImg,
    product_count: 7,
  },
  {
    id: 'milling-flours',
    name: 'Milling Flours',
    slug: 'milling-flours',
    description: 'Quality Indian flours sourced for consistent texture, reliable food applications, and international export requirements.',
    image: millingFloursImg,
    product_count: 0,
  },
  {
    id: 'spices-seasonings',
    name: 'Spices & Seasonings',
    slug: 'spices-seasonings',
    description: 'Authentic Indian spices sourced directly from origin, cleaned, graded, and packed to global export standards.',
    image: spicesSeasoningsImg,
    product_count: 39,
  },
]

/**
 * FeaturedProducts — Homepage product categories showcase connected dynamically to Supabase.
 * Renders primary showcase categories immediately to avoid blocking spinners,
 * while syncing live data in the background.
 */
const FeaturedProducts = () => {
  const [categories, setCategories] = useState(INITIAL_SHOWCASE_CATEGORIES)

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const { data } = await fetchShowcaseCategories()
        if (isMounted && data && data.length > 0) {
          setCategories(data)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load showcase categories:', err)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Product categories showcase">
      <Container>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-5 sm:mb-7 lg:mb-8">
          <SectionHeading
            label="What We Export"
            heading="Specialized Agricultural & Spices Commodities"
            description="Explore our specialized agricultural, milling, and spices & seasonings categories, sourced directly from verified Indian producers and mills."
            align="left"
            className="sm:max-w-xl"
            labelClassName="mb-1 sm:mb-1.5"
            descriptionClassName="mt-1.5 sm:mt-2 text-sm sm:text-base"
            dividerClassName="mt-2.5 sm:mt-3"
          />
          <Link
            to="/products"
            className="group flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-800 transition-colors"
            aria-label="View all products"
          >
            <span>View All Products</span>
            <svg className="h-4 w-4 transform transition-transform duration-150 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Categories grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Empty state fallback if database has no active categories with published products yet */}
        {categories.length === 0 && (
          <div className="py-14 px-6 text-center bg-surface rounded-2xl border border-slate-200 max-w-md mx-auto">
            <p className="text-sm text-slate-500 mb-5">
              Our export categories showcase is currently being updated.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        {categories.length > 0 && (
          <div className="mt-7 sm:mt-9 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-7 py-3 bg-surface hover:bg-white border border-slate-200/90 hover:border-navy-300 text-navy-700 text-sm font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200"
            >
              Browse Complete Product Range
            </Link>
          </div>
        )}

      </Container>
    </section>
  )
}

export default FeaturedProducts

