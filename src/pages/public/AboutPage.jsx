import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Eyebrow from '../../components/ui/Eyebrow'
import BuyerCTA from '../../components/sections/BuyerCTA'
import { company, getCanonicalUrl } from '../../config/company'
import aboutVisual from '../../assets/holding.png'
import { useQuoteModal } from '../../context/QuoteModalContext'

const values = [
  {
    number: '01',
    title: 'Quality',
    description:
      'We are committed to sourcing and supplying products that meet international quality expectations — from raw material selection through to final shipment.',
  },
  {
    number: '02',
    title: 'Reliability',
    description:
      'Consistent delivery, accurate documentation, and dependable communication form the foundation of every business relationship we build.',
  },
  {
    number: '03',
    title: 'Transparency',
    description:
      'Clear pricing, honest timelines, and open communication ensure buyers always know exactly what to expect.',
  },
  {
    number: '04',
    title: 'Professionalism',
    description:
      'Every interaction — from the initial inquiry to post-shipment follow-up — reflects our commitment to professional B2B trade standards.',
  },
  {
    number: '05',
    title: 'Long-Term Relationships',
    description:
      'We prioritise long-term partnerships over one-time transactions, building a business founded on mutual growth and trust.',
  },
]

/**
 * AboutPage — modernized About Us page for Akshar Worldtrade.
 * Reflects Home page design language: Navy, Gold, slate/surface backgrounds,
 * balanced two-column desktop layouts, and clean typography.
 */
const AboutPage = () => {
  const { openQuoteModal } = useQuoteModal()
  const canonicalUrl = getCanonicalUrl('/about')

  return (
    <>
      <Helmet>
        <title>About Akshar Worldtrade | Indian Export &amp; Global Trade</title>
        <meta
          name="description"
          content="Learn about Akshar Worldtrade, a trusted Indian export partner providing global buyers with quality agricultural commodities, reliable documentation, and transparent trade practices."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="About Akshar Worldtrade | Indian Export &amp; Global Trade" />
        <meta
          property="og:description"
          content="Learn about Akshar Worldtrade, a trusted Indian export partner providing global buyers with quality agricultural commodities, reliable documentation, and transparent trade practices."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="About Akshar Worldtrade | Indian Export &amp; Global Trade" />
        <meta
          name="twitter:description"
          content="Learn about Akshar Worldtrade, a trusted Indian export partner providing global buyers with quality agricultural commodities, reliable documentation, and transparent trade practices."
        />
      </Helmet>

      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-slate-50/70 via-white to-white pt-7 pb-9 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 overflow-hidden border-b border-gray-100/80">
        {/* Subtle atmospheric ambient glows */}
        <div
          className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[480px] h-[480px] bg-gradient-to-br from-navy-100/35 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-6 left-0 -translate-x-1/4 w-[360px] h-[360px] bg-gradient-to-tr from-navy-50/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <Container>
          <div className="max-w-3xl">
            {/* Pill Eyebrow */}
            <Eyebrow className="mb-2.5 sm:mb-3.5">
              About Akshar Worldtrade
            </Eyebrow>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy-900 leading-[1.15] tracking-tight">
              About Us
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 text-lg sm:text-xl lg:text-2xl font-semibold text-navy-700 leading-snug">
              Connecting Global Buyers with Quality Indian Commodities
            </p>

            {/* Concise factual introduction */}
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl">
              A professional Indian trading company committed to connecting global buyers with quality products and building lasting business relationships.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-3.5">
              <Link
                to="/products"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2"
              >
                <span>Explore Products</span>
                <svg
                  className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
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
              </Link>
              <button
                type="button"
                onClick={() => openQuoteModal()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-7 py-3.5 bg-white hover:bg-navy-50/70 text-navy-800 text-sm font-semibold rounded-lg border border-navy-200 hover:border-navy-300 shadow-2xs hover:shadow-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2 cursor-pointer"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. About Our Company & Image Section ────────────────────── */}
      <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="About our company">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center">
            {/* Left Column: Visual Presentation using provided holding.png asset */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center">
              <img
                src={aboutVisual}
                alt="Akshar Worldtrade export logistics and global trade partner"
                width={1448}
                height={1086}
                loading="lazy"
                decoding="async"
                className="w-full max-w-md lg:max-w-[420px] xl:max-w-[440px] h-auto rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/80"
              />
            </div>

            {/* Right Column: Editorial & Company Direction */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-1.5 sm:mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                <span>About Our Company</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] xl:text-[2.25rem] font-extrabold text-navy-900 leading-tight tracking-tight mb-2 sm:mb-2.5">
                Bridging Indian Supply with International Buyers
              </h2>

              <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-3 sm:mb-3.5" aria-hidden="true" />

              <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-[15px] lg:text-base">
                <p>
                  Akshar Worldtrade is an Indian import-export company focused on facilitating reliable trade between Indian suppliers and international buyers. We operate across key agricultural and commodity categories, offering products that are carefully sourced, quality-checked, and professionally prepared for global markets.
                </p>
                <p>
                  Our work is rooted in an understanding of both the Indian supply landscape and the expectations of international buyers. This dual perspective allows us to bridge the gap effectively — providing products that are not only priced competitively, but also documented, packaged, and supplied to international standards.
                </p>
                <p>
                  We believe that great international trade is built on consistent quality, honest communication, and a genuine commitment to the buyer&apos;s success. Every product we export represents our reputation, and we take that responsibility seriously.
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-100">
                <div className="bg-surface/70 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 bg-navy-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-2xs">
                        <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-navy-900">Our Mission</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To provide international buyers with access to quality Indian products through professional, transparent, and reliable export services — making global trade simpler and more trustworthy for all parties.
                    </p>
                  </div>
                </div>

                <div className="bg-surface/70 rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0 text-navy-950 shadow-2xs">
                        <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M9.664.834a.75.75 0 01.672 0l2 1a.75.75 0 11-.671 1.341L10 2.177l-1.665.832a.75.75 0 01-.671-1.342l2-1zM4.5 5.25a.75.75 0 000 1.5h.75v7.5h-.75a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5h-.75v-7.5h.75a.75.75 0 000-1.5H4.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-navy-900">Our Vision</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To be a trusted Indian trade partner known globally for quality, reliability, and the professionalism with which we handle every business relationship — from first inquiry to long-term partnership.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. What We Do & Export Markets ───────────────────────────── */}
      <section className="bg-surface/50 py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="What we do">
        <Container>
          <div className="max-w-2xl mb-5 sm:mb-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>What We Do</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight tracking-tight">
              Facilitating Global Trade Across Key Markets
            </h2>
            <div className="mt-3 h-0.5 w-12 bg-gold-500 rounded-full" aria-hidden="true" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
              We facilitate commodity procurement and container shipments for trade buyers, wholesalers, and food processors across key international destinations:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {company.exportMarkets.map((market) => (
              <div
                key={market}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-navy-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
                    <h3 className="text-sm sm:text-base font-bold text-navy-900 leading-snug">{market}</h3>
                  </div>
                  <p className="text-xs text-slate-500">Commercial trade &amp; sourcing channel</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Our Approach & Core Values ────────────────────────────── */}
      <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Our core values">
        <Container>
          <div className="max-w-2xl mb-5 sm:mb-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>Our Approach &amp; Principles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight tracking-tight">
              Core Values Guiding Every Consignment
            </h2>
            <div className="mt-3 h-0.5 w-12 bg-gold-500 rounded-full" aria-hidden="true" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
              Our approach is rooted in clear trade principles that guide how we source, inspect, document, and deliver products to global partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {values.map(({ number, title, description }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-navy-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-slate-400 group-hover:text-gold-600 transition-colors">
                      {number}
                    </span>
                    <span className="h-1.5 w-4 bg-gold-500 rounded-full" aria-hidden="true" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors mb-1.5">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Our Products
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-navy-50 text-navy-800 text-sm font-semibold rounded-lg border border-navy-200 hover:border-navy-300 shadow-2xs transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 5. High-Conversion Buyer CTA ─────────────────────────────── */}
      <BuyerCTA />
    </>
  )
}

export default AboutPage
