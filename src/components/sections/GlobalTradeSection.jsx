import { Link } from 'react-router-dom'
import Container from '../ui/Container'

const capabilities = [
  {
    label: 'Direct Sourcing',
    desc: 'Established relationships with farmers, processors, and manufacturers across India for origin-verified supply.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Export Documentation',
    desc: 'Complete support for commercial invoices, packing lists, certificates of origin, and customs compliance paperwork.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Flexible MOQ',
    desc: 'We accommodate both trial orders and large-volume container shipments tailored to buyer capacity.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    label: 'Custom Packaging',
    desc: 'Products can be packaged and labelled to buyer specifications for retail, wholesale, or food processing markets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
]

/**
 * GlobalTradeSection — business capabilities & export services.
 */
const GlobalTradeSection = () => {
  return (
    <section className="bg-surface/50 py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Global trade capabilities">
      <Container>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">

          {/* Left — strong editorial block */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-1.5 sm:mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>Export Capabilities</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight tracking-tight mb-2.5 sm:mb-3">
              From India to<br />Global Markets
            </h2>

            <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-3.5 sm:mb-4" aria-hidden="true" />

            <p className="text-slate-600 leading-relaxed mb-3 sm:mb-3.5 text-sm sm:text-base">
              India is one of the world's most significant sources for agricultural commodities, spices, pulses, and seeds. Akshar Worldtrade positions itself as a professional sourcing partner, helping international importers, wholesalers, and distributors access these products with confidence.
            </p>

            <p className="text-slate-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
              Our approach combines rigorous product quality management with professional export support — so you receive exactly what was agreed, packed and documented to your specifications.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-800 transition-colors group"
            >
              <span>Learn More About Our Company</span>
              <svg className="h-4 w-4 transform transition-transform duration-150 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Right — 4 modern capability cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {capabilities.map(({ label, desc, icon }) => (
              <div
                key={label}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-navy-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-navy-700 group-hover:bg-navy-700 group-hover:text-gold-400 group-hover:border-navy-700 flex items-center justify-center shadow-2xs transition-all duration-200 mb-3">
                    {icon}
                  </div>
                  <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700 transition-colors mb-1.5">
                    {label}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-gold-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>Verified B2B Service</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </Container>
    </section>
  )
}

export default GlobalTradeSection

