import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Eyebrow from '../../components/ui/Eyebrow'
import BuyerCTA from '../../components/sections/BuyerCTA'
import { getCanonicalUrl } from '../../config/company'

/**
 * Six core principles with complete, factual original copy preserved.
 */
const principles = [
  {
    number: '01',
    label: 'Quality-Focused Sourcing',
    paragraphs: [
      'At Akshar Worldtrade, quality is not a checkbox — it is the foundation of every sourcing decision we make. We work with established suppliers who maintain consistent product standards, and we apply our own quality assessments before any product is accepted for export.',
      'Our sourcing process prioritises product integrity: correct moisture levels, appropriate grade and sizing, absence of foreign matter, and compliance with buyer-specified requirements. We believe that delivering consistent quality builds the kind of trust that turns one-time buyers into long-term partners.',
    ],
  },
  {
    number: '02',
    label: 'Reliable Supply',
    paragraphs: [
      'International trade requires predictability. When buyers commit to an order, they need confidence that their product will arrive on time, in the right quantity, and in the condition agreed upon.',
      'We maintain reliable supplier relationships across multiple product categories and growing regions, which enables us to manage seasonal variation, provide realistic lead time estimates, and honour commitments even when market conditions fluctuate. Reliability is not just about shipping a product — it is about being a dependable partner through every step of the trade.',
    ],
  },
  {
    number: '03',
    label: 'Competitive Pricing',
    paragraphs: [
      'Our direct relationships with Indian suppliers allow us to offer competitive pricing that reflects the actual value of the product, without unnecessary intermediary markups. We are transparent about pricing structures, and we work with buyers to find solutions that make sense for their business.',
      'We do not believe in compromising quality to undercut pricing. Instead, we focus on ensuring our pricing reflects fair value for both the supplier and the buyer — a sustainable approach to long-term business relationships.',
    ],
  },
  {
    number: '04',
    label: 'Professional Documentation',
    paragraphs: [
      'Export documentation is often cited as one of the most challenging aspects of international trade. Errors or delays in documentation can cause shipment delays, customs issues, and financial penalties. We handle this with the seriousness it deserves.',
      'We provide accurate, complete documentation for every shipment — including commercial invoices, packing lists, bills of lading, certificates of origin, phytosanitary certificates where required, and other trade documents specified by the buyer’s country of import. Our goal is that when your shipment arrives, documentation is never a point of concern.',
    ],
  },
  {
    number: '05',
    label: 'Buyer-Focused Communication',
    paragraphs: [
      'We understand that many buyers — particularly those importing from India for the first time — have questions at every stage of the process. We are available to address those questions clearly and promptly, from initial product inquiry through post-shipment follow-up.',
      'Our communication approach is professional, responsive, and solution-oriented. We do not disappear after an order is placed — we keep buyers informed of production status, dispatch schedules, and shipping updates throughout the process.',
    ],
  },
  {
    number: '06',
    label: 'Long-Term Partnerships',
    paragraphs: [
      'Our business model is built on repeat business and referrals — not one-time transactions. We invest in understanding each buyer’s specific needs, preferences, and market requirements, so that we can serve them better with every order.',
      'Long-term partnerships benefit both parties: buyers gain a supplier who genuinely understands their requirements, and we build a stable, predictable business founded on mutual trust. This is how we intend to grow, and it guides every decision we make.',
    ],
  },
]

/**
 * Five Quality Approach commitment points grounded in factual project capabilities.
 */
const qualityItems = [
  {
    step: '01',
    title: 'Product Specifications',
    desc: 'Aligning closely on buyer requirements including grade, sizing, moisture parameters, and physical standards prior to order confirmation.',
  },
  {
    step: '02',
    title: 'Supplier Selection',
    desc: 'Sourcing directly from established Indian suppliers and processors who adhere to consistent product standards and reliable delivery.',
  },
  {
    step: '03',
    title: 'Quality Checks',
    desc: 'Conducting dedicated quality assessments to verify product integrity, cleanliness, and absence of foreign matter prior to export.',
  },
  {
    step: '04',
    title: 'Export Packaging',
    desc: 'Preparing suitable export packaging tailored to product type and transit conditions, aligned with buyer specifications.',
  },
  {
    step: '05',
    title: 'Documentation Support',
    desc: 'Preparing accurate, complete export documentation and trade paperwork to facilitate seamless clearance at destination customs.',
  },
]

const WhyUsPage = () => {
  const canonicalUrl = getCanonicalUrl('/why-us')

  return (
    <>
      <Helmet>
        <title>Why Choose Akshar Worldtrade | Global Export Partner</title>
        <meta
          name="description"
          content="Discover why international buyers trust Akshar Worldtrade: verified sourcing, reliable supply chains, accurate export documentation, and long-term global trade partnerships."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="Why Choose Akshar Worldtrade | Global Export Partner" />
        <meta
          property="og:description"
          content="Discover why international buyers trust Akshar Worldtrade: verified sourcing, reliable supply chains, accurate export documentation, and long-term global trade partnerships."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Why Choose Akshar Worldtrade | Global Export Partner" />
        <meta
          name="twitter:description"
          content="Discover why international buyers trust Akshar Worldtrade: verified sourcing, reliable supply chains, accurate export documentation, and long-term global trade partnerships."
        />
      </Helmet>

      {/* ── Section 1: Hero / Introduction ────────────────────────── */}
      <section className="bg-surface/60 border-b border-gray-100/90 pt-7 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14">
        <Container>
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <Eyebrow className="mb-2.5 sm:mb-3">
              OUR ADVANTAGE
            </Eyebrow>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy-900 leading-[1.18] tracking-tight mb-2 sm:mb-2.5">
              Why Choose Akshar Worldtrade?
            </h1>

            {/* Gold Accent Divider */}
            <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-3 sm:mb-3.5" aria-hidden="true" />

            {/* Description */}
            <p className="text-[15px] sm:text-base lg:text-lg text-slate-600 leading-relaxed mb-4 sm:mb-5">
              Six principles that define how we approach every business relationship and every shipment.
            </p>

            {/* Reassurance points */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-4 border-t border-slate-200/70">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Direct Indian Sourcing</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Export-Grade Quality</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Full Documentation</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section 2: Six Principles Grid ────────────────────────── */}
      <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100/80">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {principles.map(({ number, label, paragraphs }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs lg:hover:shadow-md lg:hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Number Indicator */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-navy-50 text-navy-800 border border-navy-100/80 text-xs font-extrabold tracking-wider shadow-2xs">
                      {number}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                  </div>

                  {/* Principle Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-navy-900 leading-snug mb-2">
                    {label}
                  </h2>

                  {/* Gold divider */}
                  <div className="h-0.5 w-8 bg-gold-500/80 rounded-full mb-3" aria-hidden="true" />

                  {/* Principle Paragraphs */}
                  <div className="space-y-2.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    {paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Section 3: Our Quality Approach & Commitment Panel ────── */}
      <section className="bg-surface/50 py-8 sm:py-10 lg:py-14 border-b border-gray-100/80">
        <Container>
          {/* Section Header */}
          <div className="max-w-2xl mb-5 sm:mb-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>QUALITY STARTS AT THE SOURCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-2 sm:mb-2.5">
              Our Quality Approach
            </h2>
            <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-3" aria-hidden="true" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              International trade requires continuous attention to detail. Here is our practical approach to ensuring product integrity and export readiness at every phase.
            </p>
          </div>

          {/* Two-Column Grid: Quality Rows (Left) & Commitment Panel (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* Left Column: 5 Quality Approach Cards (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5 justify-between">
              {qualityItems.map(({ step, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-start gap-3 sm:gap-3.5"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gold-50 text-gold-700 border border-gold-200/60 flex items-center justify-center text-xs font-bold mt-0.5">
                    {step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-navy-900 leading-snug mb-0.5">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Dark Navy Commitment Panel (5 cols on lg) */}
            <div className="lg:col-span-5 flex">
              <div className="relative overflow-hidden w-full bg-navy-900 rounded-2xl p-5 sm:p-7 text-white shadow-md border border-navy-800 flex flex-col justify-between">
                {/* Subtle ambient light */}
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-navy-800 border border-gold-500/30 text-gold-400 text-2xs font-bold tracking-widest uppercase mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                    <span>OUR COMMITMENT</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-2.5 leading-snug">
                    Dedicated to Dependable Trade
                  </h3>

                  <div className="h-0.5 w-8 bg-gold-500 rounded-full mb-3 sm:mb-4" aria-hidden="true" />

                  <p className="text-xs sm:text-sm text-navy-100/90 leading-relaxed mb-4 sm:mb-5">
                    Every trade relationship is built on predictability and mutual trust. At Akshar Worldtrade, we focus on understanding buyer requirements, suitable sourcing, quality handling, export preparation, and professional documentation support.
                  </p>

                  <ul className="space-y-2 text-xs sm:text-sm text-navy-200 mb-6">
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Understanding exact buyer &amp; product requirements</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Sourcing from dependable Indian suppliers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Quality handling and suitable export packaging</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Accurate trade documentation for customs clearance</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 min-h-[44px]"
                >
                  <span>Discuss Your Requirement</span>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── Section 4: Final B2B Conversion CTA ───────────────────── */}
      <BuyerCTA />
    </>
  )
}

export default WhyUsPage
