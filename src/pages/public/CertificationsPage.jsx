import { Helmet } from 'react-helmet-async'
import Container from '../../components/ui/Container'
import Eyebrow from '../../components/ui/Eyebrow'
import BuyerCTA from '../../components/sections/BuyerCTA'
import { getCanonicalUrl } from '../../config/company'
import certificationImg from '../../assets/certification.png'

/**
 * Five relevant export documentation categories.
 * Stated factually as trade paperwork categories without claiming held certifications.
 */
const documentationCategories = [
  {
    number: '01',
    title: 'Import-Export Code (IEC)',
    badge: 'Relevant Registration',
    desc: 'Essential statutory registration required for conducting commercial export operations from India.',
  },
  {
    number: '02',
    title: 'APEDA / RCMC Registration',
    badge: 'Documentation in Preparation',
    desc: 'Applicable export promotion council registration for agricultural and processed food commodities.',
  },
  {
    number: '03',
    title: 'FSSAI Registration',
    badge: 'Applicable Requirement',
    desc: 'Food safety standards and regulatory compliance applicable to food and commodity export shipments.',
  },
  {
    number: '04',
    title: 'Spices Board / CRES',
    badge: 'Applicable Requirement',
    desc: 'Statutory registration and quality export framework governed by the Spices Board of India.',
  },
  {
    number: '05',
    title: 'Phytosanitary Documentation',
    badge: 'Available on Request',
    desc: 'Plant health quarantine inspection certificates issued per consignment where required by destination customs.',
  },
  {
    number: '06',
    title: 'Certificate of Origin & Commercial Docs',
    badge: 'Available on Request',
    desc: 'Commercial invoices, packing lists, and trade documents certifying Indian origin for seamless customs clearance.',
  },
]

/**
 * Four feature blocks detailing shipment-aligned documentation coordination.
 */
const shipmentDocBlocks = [
  {
    title: 'Product & Quality Documentation',
    desc: 'Coordinating test parameters, specifications, and quality checklists aligned with agreed product standards.',
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Commercial Export Documents',
    desc: 'Preparing formal Commercial Invoices, Packing Lists, and shipping paperwork required for trade transactions.',
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: 'Origin & Shipment Documents',
    desc: 'Managing Certificates of Origin and shipment-specific trade papers relevant to international transit.',
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
  },
  {
    title: 'Destination-Market Requirements',
    desc: 'Aligning documentation packages to satisfy statutory import and customs processes in destination markets.',
    icon: (
      <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

function CertificationsPage() {
  const pageTitle = 'Certifications & Compliance | Akshar Worldtrade'
  const pageDescription =
    'Learn about Akshar Worldtrade’s export compliance, trade documentation capabilities, and statutory shipment clearance processes for global agricultural trade.'
  const canonicalUrl = getCanonicalUrl('/certifications')

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── Section 1: Compact Compliance Hero ─────────────────────── */}
      <section className="bg-surface/60 border-b border-gray-100/90 pt-5 pb-5 sm:pt-7 sm:pb-7 lg:pt-8 lg:pb-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
            {/* Left Column: Certifications & Compliance Content */}
            <div className="lg:col-span-7 xl:col-span-7">
              {/* Eyebrow badge */}
              <Eyebrow className="mb-1.5 sm:mb-2">
                COMPLIANCE
              </Eyebrow>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-navy-900 leading-[1.18] tracking-tight mb-1.5 sm:mb-2">
                Certifications &amp; Compliance
              </h1>

              {/* Gold Accent Divider */}
              <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-2 sm:mb-2.5 lg:mb-3" aria-hidden="true" />

              {/* Supporting Text */}
              <p className="text-[15px] sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                Trade documentation and compliance information supporting international buyers and export requirements.
              </p>
            </div>

            {/* Right Column: Certification Image */}
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
              <img
                src={certificationImg}
                alt="Akshar Worldtrade trade documentation and compliance certifications"
                width={1280}
                height={853}
                loading="eager"
                decoding="async"
                className="w-full max-w-sm sm:max-w-md lg:max-w-full h-auto object-contain rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section 2: Certification Documents Coming Soon ─────────── */}
      <section className="bg-surface/50 pt-3 pb-6 sm:pt-5 sm:pb-8 lg:pt-7 lg:pb-10 border-b border-gray-100/80">
        <Container>
          {/* Tasteful Informational Status Treatment */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-6 mb-3.5 sm:mb-5 lg:mb-6 max-w-3xl shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100/80 text-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
                    DOCUMENTATION &amp; COMPLIANCE
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-navy-50 text-navy-800 text-[11px] font-semibold border border-navy-100/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                    <span>Documentation in Preparation</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-900 leading-snug mb-1.5 sm:mb-2">
                  Certification Documents Coming Soon
                </h2>
                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-2 sm:mb-2.5">
                  This section will display the company’s trade certifications, export licences, and quality compliance documents once they have been formally published.
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  International buyers requiring documentation verification for specific shipments are welcome to reach out to our trade desk directly.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Documentation Category Cards: 1-col on mobile, 2-col on md, 3-col on lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {documentationCategories.map(({ number, title, badge, desc }) => (
              <div
                key={number}
                className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 lg:p-6 shadow-2xs lg:hover:shadow-md lg:hover:border-slate-300/90 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Number Indicator & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 lg:mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 text-navy-800 border border-navy-100/80 text-xs font-extrabold tracking-wider shadow-2xs">
                      {number}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-50 text-navy-800 border border-navy-100/70">
                      {badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-navy-900 leading-snug mb-1.5 sm:mb-2">
                    {title}
                  </h3>

                  {/* Gold divider */}
                  <div className="h-0.5 w-8 bg-gold-500/80 rounded-full mb-2.5 sm:mb-3" aria-hidden="true" />

                  {/* Description */}
                  <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Section 3: Documentation Aligned With Your Shipment ─────── */}
      <section className="bg-white py-5 sm:py-7 lg:py-10 border-b border-gray-100/80">
        <Container>
          {/* Section Header */}
          <div className="max-w-3xl mb-3.5 sm:mb-5 lg:mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-1.5 sm:mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>EXPORT DOCUMENTATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-2 sm:mb-2.5 lg:mb-3">
              Documentation Aligned With Your Shipment
            </h2>

            <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-2.5 sm:mb-3 lg:mb-3.5" aria-hidden="true" />

            <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
              Export documentation depends on the product, destination country, buyer requirements, and applicable regulations. We coordinate the relevant paperwork required for the shipment.
            </p>
          </div>

          {/* 4 Feature Blocks with Distinct SVG Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {shipmentDocBlocks.map(({ title, desc, icon }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200/70 flex items-center justify-center mb-2.5 sm:mb-3.5">
                    {icon}
                  </div>

                  <h3 className="text-base font-bold text-navy-900 leading-snug mb-1 sm:mb-1.5">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Section 4: Compact Regulatory Documentation Note ───────── */}
      <section className="bg-surface/60 py-3.5 sm:py-5 lg:py-6 border-b border-gray-100/80">
        <Container>
          <div className="max-w-3xl mx-auto rounded-xl bg-white border border-slate-200/90 p-3.5 sm:p-5 text-center shadow-2xs">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 mb-1 sm:mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>Regulatory Notice</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Specific documentation applicable to a shipment may vary based on the product, destination country, and buyer requirements. Contact our trade desk for documentation details related to your requirement.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Section 5: Final B2B Conversion CTA ───────────────────── */}
      <BuyerCTA />
    </>
  )
}

export default CertificationsPage
