import { Link } from 'react-router-dom'
import heroImg from '../../assets/home-screen-img.webp'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import { useQuoteModal } from '../../context/QuoteModalContext'

/**
 * Hero — Homepage hero section.
 * - Premium headline hierarchy & spacious two-column layout
 * - Unobstructed, framed view of the high-res WebP logistics visual (no text overlay on image)
 * - Tactile CTA buttons with smooth micro-interactions
 * - Key trust indicators reinforcing B2B trade credibility
 */
const Hero = () => {
  const { openQuoteModal } = useQuoteModal()
  return (
    <section className="relative bg-gradient-to-b from-slate-50/70 via-white to-white pt-6 pb-8 sm:pt-9 sm:pb-11 lg:pt-11 lg:pb-13 overflow-hidden border-b border-gray-100/80">
      
      {/* Decorative ambient background glows (subtle corporate depth) */}
      <div
        className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[520px] h-[520px] bg-gradient-to-br from-navy-100/35 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-12 left-0 -translate-x-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-navy-50/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container>
        {/* ── Main Hero Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">

          {/* ── Left Column: Brand Message & Actions (approx 50%) ───── */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            
            {/* Category / Subtitle Pill Badge */}
            <Eyebrow className="mb-2.5 sm:mb-3.5">
              Import&nbsp;|&nbsp;Export&nbsp;|&nbsp;Global Trade
            </Eyebrow>

            {/* Main Headline */}
            <h1 className="text-[clamp(2.15rem,5.5vw+0.75rem,2.5rem)] sm:text-4xl md:text-5xl lg:text-[3.15rem] xl:text-[3.4rem] font-extrabold text-navy-900 leading-[1.14] tracking-tight">
              Connecting India<br />
              <span className="text-navy-600">
                with the World
              </span>
            </h1>

            {/* Value Proposition Description */}
            <p className="mt-3 sm:mt-3.5 text-[15px] sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl">
              Akshar Worldtrade bridges international buyers with quality Indian products — offering reliable sourcing, transparent trade documentation, and long-term business partnerships built on trust.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-3.5">
              <Link
                to="/products"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2"
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
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-white hover:bg-navy-50/70 text-navy-800 text-sm font-semibold rounded-lg border border-navy-200 hover:border-navy-300 shadow-2xs hover:shadow-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2 cursor-pointer"
              >
                Request a Quote
              </button>
            </div>

            {/* Trust & Quality Pillars */}
            <div className="mt-5 pt-4 sm:mt-7 sm:pt-5 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
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
                <span>Export-Grade Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete Documentation</span>
              </div>
            </div>

          </div>

          {/* ── Right Column: Large Premium Global Trade Visual (approx 50%) */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-xl lg:max-w-none">
              
              {/* Outer decorative ambient glow frame */}
              <div
                className="absolute -inset-2 sm:-inset-3 bg-gradient-to-tr from-navy-200/40 via-gold-200/25 to-navy-100/30 rounded-3xl blur-md -z-10"
                aria-hidden="true"
              />

              {/* Main Visual Card — clean, unobstructed view with no text overlay */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-navy-950 border border-slate-200/90 shadow-xl shadow-navy-950/10 group">
                <img
                  src={heroImg}
                  alt="Akshar Worldtrade international export logistics and global trade"
                  fetchPriority="high"
                  loading="eager"
                  className="w-full h-auto object-cover aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl sm:rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

            </div>
          </div>

        </div>

      </Container>
    </section>
  )
}

export default Hero


