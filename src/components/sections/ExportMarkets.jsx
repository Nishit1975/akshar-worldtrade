import Container from '../ui/Container'
import { company } from '../../config/company'

/**
 * ExportMarkets — dedicated modern showcase of active export trade destinations.
 * Uses ONLY the verified countries configured in company.exportMarkets.
 */
const ExportMarkets = () => {
  return (
    <section className="bg-surface/70 py-6 sm:py-7 lg:py-9 border-b border-gray-100" aria-label="Export markets">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 lg:gap-10">
          
          {/* Left Title block */}
          <div className="lg:max-w-xs shrink-0">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              <span>Our Export Markets</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
              Countries We Currently Serve
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Active trade corridors supplying international importers, processors, and distributors.
            </p>
          </div>

          {/* Right Market Badges Grid / Flex */}
          <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-2.5 sm:gap-3">
            {company.exportMarkets.map((market) => (
              <div
                key={market}
                className="group inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-navy-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500 group-hover:bg-gold-600 transition-colors" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-navy-800 tracking-wide group-hover:text-navy-950 transition-colors">
                  {market}
                </span>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}

export default ExportMarkets
