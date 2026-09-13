import { Helmet } from 'react-helmet-async'
import PageHeader from '../../components/ui/PageHeader'
import Container from '../../components/ui/Container'
import { company, getWhatsAppUrl, getCanonicalUrl } from '../../config/company'
import logo from '../../assets/logo.png'
import { useQuoteModal } from '../../context/QuoteModalContext'

const CataloguePage = () => {
  const { openQuoteModal } = useQuoteModal()
  const canonicalUrl = getCanonicalUrl('/catalogue')
  const waUrl = getWhatsAppUrl(company.whatsapp, 'Hello Akshar Worldtrade, I have downloaded your export catalogue and would like to request a quotation.')
  const cataloguePdfUrl = '/catalogue/Akshar-Worldtrade-Export-Catalogue.pdf'

  const catalogueContents = [
    {
      title: 'Grains & Cereals (8 Active Products)',
      desc: 'Rice, Wheat, Yellow Corn (Maize), Millet, Mustard Seed, Barley, Oats, and Grain Sorghum.',
    },
    {
      title: 'Ground Spices (12 Active Products)',
      desc: 'Turmeric, Red Chilli, Coriander, Cumin, Fennel, Ginger, Nutmeg, Saffron, and Vanilla powders.',
    },
    {
      title: 'Whole Spices (16 Active Products)',
      desc: 'Tellicherry Black Pepper, Byadgi & Teja Chilli, Cardamom, Cloves, Ginger, Turmeric fingers & bulbs.',
    },
    {
      title: 'Seed, Blended & Exotic Spices (10 Active Products)',
      desc: 'Cumin & Coriander seeds, Biryani & Garam Masala blends, Kashmiri Saffron, and Gourmet Vanilla Beans.',
    },
    {
      title: 'Export Packaging, Standards & Process',
      desc: 'Commercial packaging standards, statutory Indian export documentation, and global export markets.',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Export Catalogue | Akshar Worldtrade</title>
        <meta
          name="description"
          content="Download the official Akshar Worldtrade export product catalogue. Comprehensive specifications, packaging options, and MOQ details for international agricultural commodities."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="Export Catalogue | Akshar Worldtrade" />
        <meta
          property="og:description"
          content="Download the official Akshar Worldtrade export product catalogue. Comprehensive specifications, packaging options, and MOQ details for international agricultural commodities."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Export Catalogue | Akshar Worldtrade" />
        <meta
          name="twitter:description"
          content="Download the official Akshar Worldtrade export product catalogue. Comprehensive specifications, packaging options, and MOQ details for international agricultural commodities."
        />
      </Helmet>

      <PageHeader
        eyebrow="Official Publication"
        heading="Product Catalogue"
        description="Download our official B2B export catalogue featuring technical specifications, packaging standards, and sourcing profiles for global buyers."
      />

      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <Container size="md">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 items-start">

            {/* Left — Catalogue document card */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Document Mockup Header */}
                <div className="bg-navy-800 p-5 text-center text-white relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2.5 bg-white rounded-lg p-2 flex items-center justify-center shadow-xs">
                    <img src={logo} alt={company.name} width="500" height="500" className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="inline-block text-3xs uppercase tracking-widest text-gold-400 font-bold mb-1">
                    Official Document
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    AKSHAR WORLDTRADE
                  </h3>
                  <p className="text-2xs text-navy-200 mt-0.5">
                    Export Product Catalogue — 2026
                  </p>
                </div>

                {/* Document metadata table */}
                <div className="p-4 sm:p-5 bg-white space-y-2.5 border-t border-gray-100 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Format</span>
                    <span className="text-navy-800 font-semibold">PDF Document (Vector)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Scope</span>
                    <span className="text-navy-800 font-semibold">32 Pages • 46 Active Products</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Language</span>
                    <span className="text-navy-800 font-semibold">English (International)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500 font-medium">Access</span>
                    <span className="text-green-700 font-semibold">Free Direct Download</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="p-4 sm:p-5 bg-surface border-t border-gray-200">
                  <a
                    href={cataloguePdfUrl}
                    download="Akshar-Worldtrade-Export-Catalogue.pdf"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors min-h-[44px]"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PDF Catalogue
                  </a>
                </div>

              </div>
            </div>

            {/* Right — Overview & Details */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-5">
              <div>
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold-600 mb-1.5">
                  Comprehensive Sourcing Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-2.5 leading-tight">
                  Everything You Need to Source from India
                </h2>
                <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-3.5" aria-hidden="true" />
                <p className="text-gray-600 leading-relaxed mb-2.5 text-sm sm:text-base">
                  Our official export catalogue provides international importers, distributors, food processors, and trading houses with clear, transparent commodity specifications, standard commercial packing options, and direct procurement channels.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Download the complete publication directly or review specific product profiles with our trade desk.
                </p>
              </div>

              {/* What's Inside Section */}
              <div className="bg-surface rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wide">
                  Inside This Edition:
                </h3>
                <div className="space-y-2.5">
                  {catalogueContents.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-800">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href={cataloguePdfUrl}
                  download="Akshar-Worldtrade-Export-Catalogue.pdf"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded transition-colors min-h-[44px]"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Catalogue
                </a>
                <button
                  type="button"
                  onClick={() => openQuoteModal()}
                  className="flex-1 inline-flex items-center justify-center px-6 py-2.5 sm:py-3 border border-navy-200 text-navy-600 hover:bg-navy-50 text-sm font-semibold rounded transition-colors cursor-pointer min-h-[44px]"
                >
                  Request a Quote
                </button>
              </div>

              {/* Direct WhatsApp CTA */}
              {company.whatsapp && waUrl && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
                  <span>Need tailored specifications or custom bag branding?</span>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-green-700 hover:text-green-800 underline"
                  >
                    <svg className="h-3.5 w-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat with Trade Desk
                  </a>
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>
    </>
  )
}

export default CataloguePage
