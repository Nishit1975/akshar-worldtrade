import { Link } from 'react-router-dom'
import logo from '../../assets/logo 2.png'
import { company, getWhatsAppUrl } from '../../config/company'
import { useQuoteModal } from '../../context/QuoteModalContext'

const quickLinks = [
  { label: 'Home',           to: '/'              },
  { label: 'About Us',       to: '/about'         },
  { label: 'Why Choose Us',  to: '/why-us'        },
  { label: 'Certifications', to: '/certifications'},
  { label: 'Contact',        to: '/contact'       },
  { label: 'Get a Quote',    to: '/contact'       },
]

const productLinks = [
  { label: 'All Products', to: '/products' },
  { label: 'Featured Products', to: '/products' },
  { label: 'Download Catalogue', to: '/catalogue' },
]

const socialConfig = [
  {
    name: 'Instagram',
    key: 'instagram',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    key: 'facebook',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    key: 'linkedin',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" clipRule="evenodd" />
      </svg>
    ),
  },
]

const Footer = () => {
  const { openQuoteModal } = useQuoteModal()
  const year = new Date().getFullYear()
  const waUrl = getWhatsAppUrl(company.whatsapp)

  const activeSocialLinks = socialConfig
    .map((item) => ({ ...item, href: company.social?.[item.key] }))
    .filter((item) => Boolean(item.href))

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-600" aria-label="Site footer">

      {/* ── Main Footer Grid ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-11 pb-7 sm:pb-8 lg:pb-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8">

          {/* Column 1 — Company (approx 4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" aria-label="AKSHAR WORLDTRADE — Home" className="inline-block">
              <img
                src={logo}
                alt={company.name}
                width="2172"
                height="724"
                loading="lazy"
                decoding="async"
                className="w-[150px] sm:w-[175px] lg:w-[190px] h-auto max-w-full object-contain mb-3 sm:mb-3.5"
              />
            </Link>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-sm">
              {company.description}
            </p>

            {/* Gold accent line */}
            <div className="mt-3 h-0.5 w-8 bg-gold-500 rounded-full" aria-hidden="true" />

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <div className="mt-3.5 sm:mt-4 flex items-center gap-2">
                {activeSocialLinks.map(({ name, key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AKSHAR WORLDTRADE on ${name}`}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-9 sm:h-9 rounded-lg bg-white text-navy-700 hover:text-navy-950 hover:bg-gold-50 hover:border-gold-400 flex items-center justify-center border border-slate-200 shadow-2xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600"
                  >
                    <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 — Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-navy-900 mb-2.5 sm:mb-3">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-0.5 sm:gap-1">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  {label === 'Get a Quote' ? (
                    <button
                      type="button"
                      onClick={() => openQuoteModal()}
                      className="py-1.5 text-left inline-block text-xs sm:text-[13px] text-slate-500 hover:text-navy-800 transition-colors duration-150 cursor-pointer"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={to}
                      className="py-1.5 inline-block text-xs sm:text-[13px] text-slate-500 hover:text-navy-800 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Products (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-navy-900 mb-2.5 sm:mb-3">
              Products
            </h3>
            <ul className="flex flex-col gap-0.5 sm:gap-1">
              {productLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="py-1.5 inline-block text-xs sm:text-[13px] text-slate-500 hover:text-navy-800 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact (4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-xs font-bold tracking-widest uppercase text-navy-900 mb-2.5 sm:mb-3">
              Export Trade Desk
            </h3>
            <address className="not-italic flex flex-col gap-2.5 sm:gap-3">
              {/* Location */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-navy-50 text-gold-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.369 17 12.938 17 10a7 7 0 10-14 0c0 2.938 1.698 5.369 3.354 6.985a19.146 19.146 0 002.274 1.765 11.879 11.879 0 00.757.433 5.745 5.745 0 00.281.14l.018.008.006.003zM10 11.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs sm:text-[13px] text-slate-500 leading-snug">
                  {company.address.formatted ? (
                    company.address.formatted
                  ) : (
                    <>
                      India
                      <span className="block text-xs text-slate-400">Global B2B Export</span>
                    </>
                  )}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-navy-50 text-gold-600 flex items-center justify-center shrink-0">
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </div>
                <a
                  href={`mailto:${company.email}`}
                  className="py-0.5 text-xs sm:text-[13px] text-slate-500 hover:text-navy-800 transition-colors break-all sm:break-normal"
                >
                  {company.email}
                </a>
              </div>

              {/* Phone / WhatsApp (Combined into one entry) */}
              {(company.phone || company.whatsapp) && (
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-navy-50 text-gold-600 flex items-center justify-center shrink-0">
                    <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="text-xs sm:text-[13px] text-slate-500">
                    <span className="text-3xs text-slate-400 uppercase tracking-wider block font-semibold">Phone / WhatsApp</span>
                    <a
                      href={waUrl || `tel:${company.phone.replace(/\s+/g, '')}`}
                      target={waUrl ? '_blank' : undefined}
                      rel={waUrl ? 'noopener noreferrer' : undefined}
                      className="py-0.5 font-medium text-slate-700 hover:text-navy-900 transition-colors"
                    >
                      {company.phone || '+91 63538 55938'}
                    </a>
                  </div>
                </div>
              )}

              {/* Chat with Trade Desk action */}
              {company.whatsapp && waUrl && (
                <div className="pt-0.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>Chat with Trade Desk</span>
                  </a>
                </div>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* ── Copyright Bar ───────────────────────────────────────── */}
      <div className="border-t border-slate-200/80 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            &copy; {year} AKSHAR WORLDTRADE. All rights reserved.
          </p>
          <p className="text-xs font-medium text-slate-400 tracking-wide">
            Connecting India with the World
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
