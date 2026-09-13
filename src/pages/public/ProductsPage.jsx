import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Container from '../../components/ui/Container'
import Eyebrow from '../../components/ui/Eyebrow'
import ProductCard from '../../components/ui/ProductCard'
import EmptyState from '../../components/ui/EmptyState'
import { getPublishedProducts } from '../../services/products'
import { fetchPublicCategories } from '../../services/categories'
import { fetchPublicSubcategories } from '../../services/subcategories'
import { getCanonicalUrl } from '../../config/company'

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

const DEFAULT_CATEGORIES = [
  { id: 'grains-cereals', name: 'Grains & Cereals', slug: 'grains-cereals' },
  { id: 'milling-flours', name: 'Milling Flours', slug: 'milling-flours' },
  { id: 'spices-seasonings', name: 'Spices & Seasonings', slug: 'spices-seasonings' },
]

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES)
  const [subcategoriesList, setSubcategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [retryCount, setRetryCount] = useState(0)

  // Current category from URL query param (?category=slug_or_id)
  const activeCategory = searchParams.get('category') || 'all'
  // Current subcategory from URL query param (?subcategory=slug_or_id)
  const activeSubcategory = searchParams.get('subcategory') || 'all'

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          getPublishedProducts(),
          fetchPublicCategories(),
          fetchPublicSubcategories(),
        ])

        if (!isMounted) return

        if (productsRes.error) {
          setError(productsRes.error.message || 'Failed to load products')
        } else {
          const loadedProducts = productsRes.data || []
          const sortedProducts = [...loadedProducts].sort(
            (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          )
          setProducts(sortedProducts)
          if (categoriesRes.data && categoriesRes.data.length > 0) {
            setCategoriesList(categoriesRes.data)
          }
          if (subcategoriesRes.data && subcategoriesRes.data.length > 0) {
            setSubcategoriesList(subcategoriesRes.data)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load products. Please check your connection and try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [retryCount])

  // Helper to check if a category is active based on slug, ID, or name
  const isCatActive = (cat) => {
    if (!activeCategory || activeCategory === 'all') return false
    const term = activeCategory.toLowerCase()
    return (
      (cat.id && cat.id.toLowerCase() === term) ||
      (cat.slug && cat.slug.toLowerCase() === term) ||
      (cat.name && cat.name.toLowerCase() === term)
    )
  }

  // Active category object & its subcategories
  const currentCategoryObj = categoriesList.find((cat) => isCatActive(cat))
  const relevantSubcategories = currentCategoryObj
    ? subcategoriesList.filter((s) => s.category_id === currentCategoryObj.id)
    : []

  // Helper to check if a subcategory is active
  const isSubActive = (sub) => {
    if (!activeSubcategory || activeSubcategory === 'all') return false
    const term = activeSubcategory.toLowerCase()
    return (
      (sub.id && sub.id.toLowerCase() === term) ||
      (sub.slug && sub.slug.toLowerCase() === term) ||
      (sub.name && sub.name.toLowerCase() === term)
    )
  }

  const handleCategoryChange = (catIdOrSlug) => {
    const nextVal = (!catIdOrSlug || catIdOrSlug === 'all') ? 'all' : catIdOrSlug
    const nextParams = new URLSearchParams(searchParams)
    if (nextVal === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', nextVal)
    }
    // Always reset subcategory filter when switching main category
    nextParams.delete('subcategory')
    setSearchParams(nextParams)
  }

  const handleSubcategoryChange = (subSlugOrId) => {
    const nextVal = (!subSlugOrId || subSlugOrId === 'all') ? 'all' : subSlugOrId
    const nextParams = new URLSearchParams(searchParams)
    if (nextVal === 'all') {
      nextParams.delete('subcategory')
    } else {
      nextParams.set('subcategory', nextVal)
    }
    setSearchParams(nextParams)
  }

  const handleClearFilters = () => {
    setSearch('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('category')
    nextParams.delete('subcategory')
    setSearchParams(nextParams)
  }

  // Dynamic count calculator for categories
  const getCategoryCount = (cat) => {
    if (!cat || cat === 'all') return products.length
    const term = (cat.id || cat.slug || cat.name || '').toLowerCase()
    return products.filter((p) => {
      const pCatId = (p.category_id || '').toLowerCase()
      const pCatObjId = (p.categories?.id || '').toLowerCase()
      const pCatSlug = (p.categories?.slug || '').toLowerCase()
      const pCatName = (p.categories?.name || p.category || '').toLowerCase()
      return pCatId === term || pCatObjId === term || pCatSlug === term || pCatName === term
    }).length
  }

  // Dynamic count calculator for subcategories
  const getSubcategoryCount = (sub) => {
    if (!sub || sub === 'all') {
      return currentCategoryObj ? getCategoryCount(currentCategoryObj) : products.length
    }
    const term = (sub.id || sub.slug || sub.name || '').toLowerCase()
    return products.filter((p) => {
      const pSubId = (p.subcategory_id || '').toLowerCase()
      const pSubObjId = (p.subcategories?.id || '').toLowerCase()
      const pSubSlug = (p.subcategories?.slug || '').toLowerCase()
      const pSubName = (p.subcategories?.name || '').toLowerCase()
      return pSubId === term || pSubObjId === term || pSubSlug === term || pSubName === term
    }).length
  }

  // Derive filtered list based on active category, active subcategory, and search
  let filtered = products

  if (activeCategory && activeCategory !== 'all') {
    const term = activeCategory.toLowerCase()
    filtered = filtered.filter((p) => {
      const pCatId = (p.category_id || '').toLowerCase()
      const pCatObjId = (p.categories?.id || '').toLowerCase()
      const pCatSlug = (p.categories?.slug || '').toLowerCase()
      const pCatName = (p.categories?.name || p.category || '').toLowerCase()
      return (
        pCatId === term ||
        pCatObjId === term ||
        pCatSlug === term ||
        pCatName === term
      )
    })
  }

  if (activeSubcategory && activeSubcategory !== 'all') {
    const subTerm = activeSubcategory.toLowerCase()
    filtered = filtered.filter((p) => {
      const pSubId = (p.subcategory_id || '').toLowerCase()
      const pSubObjId = (p.subcategories?.id || '').toLowerCase()
      const pSubSlug = (p.subcategories?.slug || '').toLowerCase()
      const pSubName = (p.subcategories?.name || '').toLowerCase()
      return (
        pSubId === subTerm ||
        pSubObjId === subTerm ||
        pSubSlug === subTerm ||
        pSubName === subTerm
      )
    })
  }

  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const desc = (p.short_description || p.shortDescription || '').toLowerCase()
      const catName = (p.categories?.name || p.category || '').toLowerCase()
      const subName = (p.subcategories?.name || '').toLowerCase()
      return name.includes(q) || desc.includes(q) || catName.includes(q) || subName.includes(q)
    })
  }

  const isFilterActive = search.trim() !== '' || (activeCategory && activeCategory !== 'all') || (activeSubcategory && activeSubcategory !== 'all')

  const canonicalUrl = getCanonicalUrl('/products')

  return (
    <>
      <Helmet>
        <title>Products | Akshar Worldtrade</title>
        <meta
          name="description"
          content="Explore Akshar Worldtrade's export product portfolio including Indian basmati rice, spices, oilseeds, and pulses. High-grade bulk commodities with complete export certification."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="Products | Akshar Worldtrade" />
        <meta
          property="og:description"
          content="Explore Akshar Worldtrade's export product portfolio including Indian basmati rice, spices, oilseeds, and pulses. High-grade bulk commodities with complete export certification."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Products | Akshar Worldtrade" />
        <meta
          name="twitter:description"
          content="Explore Akshar Worldtrade's export product portfolio including Indian basmati rice, spices, oilseeds, and pulses. High-grade bulk commodities with complete export certification."
        />
      </Helmet>

      {/* ── 1. Modern Products Catalogue Hero ─────────────────────────── */}
      <section className="relative bg-gradient-to-b from-slate-50/70 via-white to-white pt-7 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 overflow-hidden border-b border-gray-100/80">
        {/* Ambient background glows */}
        <div
          className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[480px] h-[480px] bg-gradient-to-br from-navy-100/35 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-4 left-0 -translate-x-1/4 w-[360px] h-[360px] bg-gradient-to-tr from-navy-50/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <Container>
          <div className="max-w-3xl">
            {/* Pill Eyebrow */}
            <Eyebrow className="mb-2.5 sm:mb-3.5">
              OUR PRODUCT RANGE
            </Eyebrow>

            {/* Main Heading */}
            <h1 className="text-[1.95rem] sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-navy-900 leading-[1.2] sm:leading-[1.15] tracking-tight">
              Indian Commodities for Global Markets
            </h1>

            {/* Description */}
            <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Explore our range of Indian agricultural commodities, milling flours, spices, and seasonings sourced for international buyers, distributors, and food businesses.
            </p>

            {/* Factual Trade Highlights */}
            <div className="mt-4 pt-3.5 sm:mt-5 sm:pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6 sm:gap-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Direct Producer Sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Container Consignments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Standard Export Documentation</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. Catalogue Content Section ─────────────────────────────── */}
      <section className="bg-white py-6 sm:py-8 lg:py-10">
        <Container>

          {/* Error State */}
          {!loading && error && (
            <div className="py-14 sm:py-16">
              <EmptyState
                icon={
                  <svg className="h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                }
                title="Unable to load products"
                description={error}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true)
                      setError(null)
                      setRetryCount((c) => c + 1)
                    }}
                    className="px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Try Again
                  </button>
                }
              />
            </div>
          )}

          {/* Catalogue Content — Renders shell & filters immediately */}
          {!error && (
            <>
              {/* ── Floating Filter & Search Panel ─────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm shadow-slate-900/5 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6">
                <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 lg:items-center lg:justify-between">

                  {/* Search Input with Search Icon & Clear Button */}
                  <div className="relative w-full lg:max-w-xs">
                    <label htmlFor="product-search" className="sr-only">
                      Search products
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                      </svg>
                    </div>
                    <input
                      id="product-search"
                      type="text"
                      placeholder="Search products by name or category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 min-h-[44px] sm:min-h-[40px] text-sm bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-navy-950 placeholder-slate-400 border border-slate-200 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-400 hover:text-navy-700 transition-colors"
                        aria-label="Clear search query"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Main Category Filter Tabs */}
                  {categoriesList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="group" aria-label="Filter by product category">
                      {/* "All" Tab */}
                      <button
                        type="button"
                        onClick={() => handleCategoryChange('all')}
                        className={[
                          'inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-150 min-h-[40px]',
                          (!activeCategory || activeCategory === 'all')
                            ? 'bg-navy-600 text-white border-navy-600 shadow-2xs'
                            : 'bg-surface hover:bg-slate-100 text-slate-700 hover:text-navy-900 border-slate-200/80',
                        ].join(' ')}
                        aria-pressed={!activeCategory || activeCategory === 'all'}
                      >
                        <span>All</span>
                        <span
                          className={[
                            'text-2xs px-1.5 py-0.5 rounded-full font-bold',
                            (!activeCategory || activeCategory === 'all')
                              ? 'bg-navy-800/80 text-gold-300'
                              : 'bg-slate-200/70 text-slate-600',
                          ].join(' ')}
                        >
                          {loading ? '...' : products.length}
                        </span>
                      </button>

                      {/* Dynamic Category Tabs */}
                      {categoriesList.map((cat) => {
                        const active = isCatActive(cat)
                        const displayName = normalizeCategoryLabel(cat.name)
                        const count = getCategoryCount(cat)

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryChange(cat.slug || cat.id)}
                            className={[
                              'inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-150 min-h-[40px]',
                              active
                                ? 'bg-navy-600 text-white border-navy-600 shadow-2xs'
                                : 'bg-surface hover:bg-slate-100 text-slate-700 hover:text-navy-900 border-slate-200/80',
                            ].join(' ')}
                            aria-pressed={active}
                          >
                            <span>{displayName}</span>
                            <span
                              className={[
                                'text-2xs px-1.5 py-0.5 rounded-full font-bold',
                                active
                                  ? 'bg-navy-800/80 text-gold-300'
                                  : 'bg-slate-200/70 text-slate-600',
                              ].join(' ')}
                            >
                              {loading ? '...' : count}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* ── Subcategory Filter Bar (Spices & Seasonings etc.) ── */}
                {relevantSubcategories.length > 0 && (
                  <div
                    className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 mt-3 sm:pt-3.5 sm:mt-3.5 border-t border-slate-100"
                    role="group"
                    aria-label="Filter by subcategory"
                  >
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 w-full sm:w-auto mb-1 sm:mb-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                      <span>Subcategory:</span>
                    </span>

                    {/* "All" Subcategory option */}
                    <button
                      type="button"
                      onClick={() => handleSubcategoryChange('all')}
                      className={[
                        'inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 min-h-[36px]',
                        (!activeSubcategory || activeSubcategory === 'all')
                          ? 'bg-gold-500 text-navy-950 border-gold-500 font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-navy-900 border-slate-200',
                      ].join(' ')}
                      aria-pressed={!activeSubcategory || activeSubcategory === 'all'}
                    >
                      <span>All {normalizeCategoryLabel(currentCategoryObj?.name) || ''}</span>
                      <span
                        className={[
                          'text-3xs px-1.5 py-0.5 rounded-full font-bold',
                          (!activeSubcategory || activeSubcategory === 'all')
                            ? 'bg-gold-600 text-navy-950'
                            : 'bg-slate-100 text-slate-600',
                        ].join(' ')}
                      >
                        {loading ? '...' : getSubcategoryCount('all')}
                      </span>
                    </button>

                    {/* Subcategories list */}
                    {relevantSubcategories.map((sub) => {
                      const active = isSubActive(sub)
                      const count = getSubcategoryCount(sub)

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubcategoryChange(sub.slug || sub.id)}
                          className={[
                            'inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 min-h-[36px]',
                            active
                              ? 'bg-gold-500 text-navy-950 border-gold-500 font-bold shadow-2xs'
                              : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-navy-900 border-slate-200',
                          ].join(' ')}
                          aria-pressed={active}
                        >
                          <span>{sub.name}</span>
                          <span
                            className={[
                              'text-3xs px-1.5 py-0.5 rounded-full font-bold',
                              active
                                ? 'bg-gold-600 text-navy-950'
                                : 'bg-slate-100 text-slate-600',
                            ].join(' ')}
                          >
                            {loading ? '...' : count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ── Product Count & Active Filter Indicator ─────────── */}
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 pb-1 sm:pb-2">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600" aria-live="polite">
                    {loading ? (
                      <span className="text-slate-500 font-normal">Loading products from catalog…</span>
                    ) : (
                      <>
                        <span className="text-navy-900 font-bold">{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'} found
                        {currentCategoryObj && (
                          <span className="text-slate-500 font-normal">
                            {' '}in <span className="font-semibold text-navy-800">{normalizeCategoryLabel(currentCategoryObj.name)}</span>
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>

                {isFilterActive && !loading && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-navy-900 transition-colors w-fit shrink-0 py-1 px-1.5 rounded-md hover:bg-navy-50"
                  >
                    <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Clear all filters</span>
                  </button>
                )}
              </div>

              {/* ── 3. Product Catalogue Grid (or Skeleton Grid while loading) ── */}
              {loading ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  aria-busy="true"
                  aria-label="Loading products"
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-full animate-pulse"
                    >
                      <div className="w-full aspect-[4/3] bg-slate-100" />
                      <div className="flex flex-col flex-1 p-3.5 sm:p-5 justify-between gap-3">
                        <div>
                          <div className="h-4 w-20 bg-slate-200/80 rounded-md mb-2.5" />
                          <div className="h-5 w-3/4 bg-slate-200/80 rounded-md mb-2" />
                          <div className="h-3.5 w-full bg-slate-100 rounded-md mb-1.5" />
                          <div className="h-3.5 w-2/3 bg-slate-100 rounded-md" />
                        </div>
                        <div className="pt-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-9 bg-slate-100 rounded-lg" />
                            <div className="flex-1 h-9 bg-slate-200/80 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="h-14 w-14 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                    </svg>
                  }
                  title="No products match your search"
                  description="Try adjusting your search terms, selecting another category, or clearing filters."
                  action={
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Clear Filters
                    </button>
                  }
                />
              )}
            </>
          )}

        </Container>
      </section>
    </>
  )
}

export default ProductsPage
