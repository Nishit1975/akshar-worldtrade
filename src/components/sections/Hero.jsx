import { Link } from 'react-router-dom'
import heroBgImg from '../../assets/home-hero-bg.png'
import Container from '../ui/Container'
import Eyebrow from '../ui/Eyebrow'
import { useQuoteModal } from '../../context/QuoteModalContext'

/**
 * Hero — Homepage hero section.
 *
 * Background image: home-hero-bg.png (1720 × 914 px, aspect ~1.88:1)
 *
 * Mobile strategy:
 *  - background-size: cover with background-position tuned via .hero-section CSS
 *    to show the crane/ship/truck centred (right side of image) while the sky and
 *    airplane appear at the top.
 *  - Very light overlay (white/20) on mobile so the bright airy harbour remains vivid.
 *  - No white card behind the description on mobile — text is directly readable
 *    on the bright sky background.
 *  - Buttons full-width stacked on mobile (flex-col), side-by-side on desktop (lg:flex-row).
 *  - Benefit labels: translucent white pills, stacked vertically on mobile,
 *    horizontal row on desktop.
 *  - Heading "World" in gold on all breakpoints (matches reference).
 *
 * Desktop strategy (unchanged from previous approved implementation):
 *  - background-position: center center (via .hero-section @media 1024px rule)
 *  - Left-side white gradient for text contrast
 *  - White card behind description for legibility
 *  - lg:max-w-[58%] content constraint so harbour is visible on right
 */
const Hero = () => {
  const { openQuoteModal } = useQuoteModal()
  return (
    <section
      className="hero-section relative overflow-hidden border-b border-gray-100/80
        pt-16 pb-8
        sm:pt-10 sm:pb-10
        lg:pt-20 lg:pb-20"
      style={{
        backgroundImage: `url(${heroBgImg})`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/*
        ── Mobile overlay: very light so the bright airy harbour stays vivid (matches reference).
           Desktop overlay: slightly stronger, plus left gradient for text contrast.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        data-mobile-overlay="true"
        aria-hidden="true"
      />
      {/* Desktop-only stronger overlay */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block bg-white/35"
        aria-hidden="true"
      />

      {/* Desktop-only left-side gradient for text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent pointer-events-none hidden lg:block"
        aria-hidden="true"
      />
      {/* Mobile-only: very subtle left gradient so text remains legible against bright sky */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/10 to-transparent pointer-events-none lg:hidden"
        aria-hidden="true"
      />

      <Container className="relative z-10 !px-5 sm:!px-6 lg:!px-8">
        <div className="w-full lg:max-w-[58%] xl:max-w-[52%] flex flex-col">

          {/* ── Eyebrow Badge ────────────────────────────────────────────── */}
          <Eyebrow className="mb-4 sm:mb-3.5">
            Import&nbsp;|&nbsp;Export&nbsp;|&nbsp;Global Trade
          </Eyebrow>

          {/* ── Main Headline ─────────────────────────────────────────────
               "World" is gold on all breakpoints (matches reference image).
               "Connecting India" and "with the" stay navy-900.
          ──────────────────────────────────────────────────────────────── */}
          <h1 className="
            text-[26px] leading-[1.22] tracking-tight font-extrabold text-navy-900
            sm:text-4xl sm:leading-[1.14]
            md:text-5xl
            lg:text-[3.15rem]
            xl:text-[3.4rem]
            drop-shadow-sm
          ">
            Connecting India<br />
            <span className="text-navy-900">with the </span><span className="text-gold-500">World</span>
          </h1>

          {/* ── Description ───────────────────────────────────────────────
               Mobile : directly over the harbor background without a card,
                        readable 16px dark blue-gray text and ~1.5 line-height
               Desktop: translucent white card (lg: classes) preserved exactly
          ──────────────────────────────────────────────────────────────── */}
          <p
            className="
              hero-description
              mt-4 sm:mt-4
              text-sm sm:text-base lg:text-lg
              text-slate-700 font-normal sm:text-navy-900 sm:font-semibold lg:text-slate-700 lg:font-normal
              leading-[1.45] max-w-[300px] sm:max-w-none sm:leading-[1.55]
              lg:bg-white/85 lg:backdrop-blur-sm lg:rounded-xl lg:px-5 lg:py-3.5 lg:max-w-xl
            "
            style={{
              textShadow: '0 1px 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.6)',
            }}
          >
            Akshar Worldtrade bridges international buyers with quality Indian products — offering reliable sourcing, transparent trade documentation, and long-term business partnerships built on trust.
          </p>

          {/* ── Action Buttons ────────────────────────────────────────────
               Mobile : full-width stacked (w-full), ~10-12px vertical spacing
               Desktop: auto-width side by side (lg:flex-row)
          ──────────────────────────────────────────────────────────────── */}
          <div className="mt-[110px] sm:mt-6 flex max-w-[250px] sm:max-w-none flex-col lg:flex-row gap-1.5 sm:gap-3 lg:gap-3.5">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3
                w-full lg:w-auto
                bg-navy-600 hover:bg-navy-700 text-white text-xs sm:text-sm font-semibold
                rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2"
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
              className="inline-flex items-center justify-center px-5 py-2.5 sm:py-3
                w-full lg:w-auto
                bg-white hover:bg-navy-50/70 text-navy-800 text-xs sm:text-sm font-semibold
                rounded-lg border border-navy-200 hover:border-navy-300
                shadow-2xs hover:shadow-xs
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2
                cursor-pointer"
            >
              Request a Quote
            </button>
          </div>

          {/* ── Benefit Labels ────────────────────────────────────────────
               Mobile : compact readable pill labels, ~10-12px vertical spacing
               Desktop: horizontal row
          ──────────────────────────────────────────────────────────────── */}
          <div className="mt-4 pt-0 sm:mt-5 sm:pt-4 lg:mt-5 lg:pt-4 border-t-0 sm:border-t border-white/50 flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-1.5 sm:gap-2 lg:gap-x-5 lg:gap-y-2.5">

            <div
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-2 rounded-full text-[10.5px] sm:text-xs font-semibold text-navy-900 backdrop-blur-sm shadow-sm w-fit"
              style={{ backgroundColor: 'rgba(255,255,255,0.80)' }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Direct Producer Sourcing</span>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-2 rounded-full text-[10.5px] sm:text-xs font-semibold text-navy-900 backdrop-blur-sm shadow-sm w-fit"
              style={{ backgroundColor: 'rgba(255,255,255,0.80)' }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Export-Grade Quality</span>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-2 rounded-full text-[10.5px] sm:text-xs font-semibold text-navy-900 backdrop-blur-sm shadow-sm w-fit"
              style={{ backgroundColor: 'rgba(255,255,255,0.80)' }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Complete Documentation</span>
            </div>

          </div>

        </div>
      </Container>
    </section>
  )
}

export default Hero
