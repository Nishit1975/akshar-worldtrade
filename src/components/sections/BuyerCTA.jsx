import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import { company, getWhatsAppUrl } from '../../config/company'
import { useQuoteModal } from '../../context/QuoteModalContext'

/**
 * BuyerCTA — strong conversion section for international B2B buyers.
 * Elevated navy + gold visual identity with full contact pathways.
 */
const BuyerCTA = () => {
  const { openQuoteModal } = useQuoteModal()
  const waUrl = getWhatsAppUrl(company.whatsapp)

  return (
    <section className="relative bg-navy-900 py-8 sm:py-9 lg:py-10 overflow-hidden" aria-label="Contact us">
      
      {/* Subtle atmospheric ambient glows */}
      <div
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[360px] h-[360px] bg-gradient-to-br from-navy-700/50 via-gold-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[320px] h-[320px] bg-gradient-to-tr from-navy-800 via-gold-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className="relative text-center max-w-3xl mx-auto">

          {/* Gold capsule badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-widest uppercase mb-2 sm:mb-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            <span>Connect With Our Trade Desk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-2.5">
            Looking for Reliable Products from India?
          </h2>

          <p className="text-navy-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-4 sm:mb-5">
            Whether you are an importer, wholesaler, or distributor, Akshar Worldtrade is ready to support your sourcing needs with quality products, transparent pricing, and professional service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={() => openQuoteModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] cursor-pointer"
            >
              <span>Request a Quote</span>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>

            {company.whatsapp && waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px]"
              >
                <svg className="h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
            ) : (
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px]"
              >
                Contact Our Trade Team
              </Link>
            )}
          </div>

          {/* Quick contact direct line */}
          <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-xs sm:text-sm text-navy-200 text-center">
            <span>Email:&nbsp;<a href={`mailto:${company.email}`} className="text-white hover:text-gold-300 font-semibold underline break-all sm:break-normal">{company.email}</a></span>
            <span className="hidden sm:inline text-navy-500">&bull;</span>
            <span>Origin:&nbsp;<span className="text-white font-semibold">Rajkot, Gujarat, India</span></span>
          </div>

        </div>
      </Container>
    </section>
  )
}

export default BuyerCTA

