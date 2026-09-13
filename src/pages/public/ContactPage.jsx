import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Eyebrow from '../../components/ui/Eyebrow'
import EnquiryForm from '../../components/forms/EnquiryForm'
import { company, getWhatsAppUrl, getCanonicalUrl } from '../../config/company'

const ContactPage = () => {
  const [searchParams] = useSearchParams()
  const initialProduct = searchParams.get('product') || ''
  const waUrl = getWhatsAppUrl(company.whatsapp)
  const mapQuery = encodeURIComponent(company.address.formatted || 'Rajkot, Gujarat, India')
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`

  const canonicalUrl = getCanonicalUrl('/contact')
  const pageTitle = 'Contact Akshar Worldtrade | Global Trade Enquiries'
  const pageDescription =
    'Contact Akshar Worldtrade in Rajkot, Gujarat, India. Connect with our export sales desk for commodity pricing, sample requests, and global logistics support.'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* ── Section 1: Contact Hero ───────────────────────────────── */}
      <section className="bg-surface/60 border-b border-gray-100/90 pt-7 pb-8 sm:pt-9 sm:pb-10 lg:pt-11 lg:pb-12">
        <Container>
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <Eyebrow className="mb-2.5 sm:mb-3">
              GET IN TOUCH
            </Eyebrow>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-navy-900 leading-[1.18] tracking-tight mb-2.5 sm:mb-3">
              Contact Akshar Worldtrade
            </h1>

            {/* Gold Accent Divider */}
            <div className="h-0.5 w-12 bg-gold-500 rounded-full mb-3 sm:mb-3.5" aria-hidden="true" />

            {/* Supporting Text */}
            <p className="text-[15px] sm:text-base lg:text-lg text-slate-600 leading-relaxed">
              We welcome inquiries from importers, wholesalers, distributors, and trade buyers looking for reliable Indian agricultural and spice products.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Section 2: Contact Information + Enquiry Section ────────── */}
      <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── Left Column: Enquiry Form Area (7 cols on lg) ──────── */}
            <div className="lg:col-span-7">
              <div className="mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>SEND AN ENQUIRY</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight mb-2.5">
                  Tell Us About Your Requirements
                </h2>

                <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-3 sm:mb-3.5" aria-hidden="true" />

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Share your product and shipment requirements with our export trade desk. We will review your inquiry and respond with relevant pricing, availability, and shipping information.
                </p>
              </div>

              {/* Form Container Card */}
              <div className="bg-surface/50 rounded-2xl border border-slate-200/90 p-4 sm:p-6 lg:p-7 shadow-2xs">
                <EnquiryForm initialProduct={initialProduct} inlineSuccess />
              </div>
            </div>

            {/* ── Right Column: Contact Info, Map & WhatsApp CTA (5 cols on lg) ── */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">

              {/* Contact Information Card */}
              <div className="bg-surface/50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 lg:p-6 shadow-2xs">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-600 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>CONTACT INFORMATION</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-navy-900 leading-snug mb-1.5">
                  Reach Our Trade Desk
                </h3>

                <div className="h-0.5 w-8 bg-gold-500/80 rounded-full mb-4 sm:mb-5" aria-hidden="true" />

                <div className="space-y-3.5 sm:space-y-4">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 border border-navy-100/80 text-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gold-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.369 17 12.938 17 10a7 7 0 10-14 0c0 2.938 1.698 5.369 3.354 6.985a19.146 19.146 0 002.274 1.765 11.879 11.879 0 00.757.433 5.745 5.745 0 00.281.14l.018.008.006.003zM10 11.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        LOCATION
                      </p>
                      <p className="text-sm font-semibold text-navy-900 leading-snug">
                        Rajkot, Gujarat, India
                      </p>
                    </div>
                  </div>

                  {/* Phone / WhatsApp (Combined into one entry) */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 border border-navy-100/80 text-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gold-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        PHONE / WHATSAPP
                      </p>
                      <a
                        href={waUrl || `tel:${company.phone.replace(/\s+/g, '')}`}
                        target={waUrl ? '_blank' : undefined}
                        rel={waUrl ? 'noopener noreferrer' : undefined}
                        className="text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors leading-snug inline-flex items-center gap-1.5"
                      >
                        <span>{company.phone || '+91 63538 55938'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 border border-navy-100/80 text-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gold-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        EMAIL
                      </p>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors leading-snug break-all sm:break-normal"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 border border-navy-100/80 text-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        WORKING HOURS
                      </p>
                      <p className="text-sm font-semibold text-navy-900 leading-snug">
                        Monday – Saturday
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        10:00 AM – 7:00 PM IST (Sunday: Closed)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rajkot Location Map */}
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <div className="px-4 py-2.5 bg-surface/70 border-b border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                    <span>Location: Rajkot, Gujarat, India</span>
                  </span>
                </div>
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100">
                  <iframe
                    title="Map showing Rajkot, Gujarat, India"
                    src={mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* WhatsApp CTA Card */}
              <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-surface p-4 sm:p-5 shadow-2xs">
                <div className="inline-flex items-center gap-1.5 text-2xs font-bold tracking-widest uppercase text-emerald-700 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>PREFER TO CHAT?</span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-navy-900 mb-1.5">
                  Chat Directly With Our Export Desk
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-3.5">
                  For quick product inquiries and shipment discussions, connect with us directly on WhatsApp.
                </p>

                <a
                  href={waUrl || 'https://wa.me/916353855938'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 w-full px-5 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp →</span>
                </a>
              </div>

            </div>

          </div>
        </Container>
      </section>
    </>
  )
}

export default ContactPage
