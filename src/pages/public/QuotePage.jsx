import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Container from '../../components/ui/Container'
import EnquiryForm from '../../components/forms/EnquiryForm'
import { company, getWhatsAppUrl, getCanonicalUrl } from '../../config/company'

const QuotePage = () => {
  const [searchParams] = useSearchParams()
  const initialProduct = searchParams.get('product') || ''

  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  const handleSubmitted = (formData) => {
    setSubmittedName(formData.fullName)
    setSubmitted(true)
  }

  // ── Success state ───────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Quote Submitted | Akshar Worldtrade</title>
        </Helmet>
        <PageHeader eyebrow="Thank You" heading="Enquiry Received" />
        <section className="bg-white py-8 sm:py-10 lg:py-12">
          <Container size="sm">
            <div className="text-center py-8 px-4 sm:px-6">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-50 mb-4">
                <svg className="h-7 w-7 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">Thank you, {submittedName}!</h2>
              <p className="text-gray-500 leading-relaxed mb-2 max-w-sm mx-auto text-sm">
                Your enquiry has been submitted successfully. Our trade desk will review your requirements and get back to you with a detailed quotation.
              </p>
              <p className="text-xs text-gray-400 mb-5">Please allow 1–2 business days for a response.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-navy-600 hover:bg-navy-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Continue Browsing Products
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setSubmittedName('')
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          </Container>
        </section>
      </>
    )
  }

  // ── Form ────────────────────────────────────────────────────
  const canonicalUrl = getCanonicalUrl('/quote')

  return (
    <>
      <Helmet>
        <title>Request a Quote | Akshar Worldtrade</title>
        <meta
          name="description"
          content="Request a customized export quotation from Akshar Worldtrade. Bulk pricing, container specifications, and global CIF/FOB terms for international B2B buyers."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="Request a Quote | Akshar Worldtrade" />
        <meta
          property="og:description"
          content="Request a customized export quotation from Akshar Worldtrade. Bulk pricing, container specifications, and global CIF/FOB terms for international B2B buyers."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Request a Quote | Akshar Worldtrade" />
        <meta
          name="twitter:description"
          content="Request a customized export quotation from Akshar Worldtrade. Bulk pricing, container specifications, and global CIF/FOB terms for international B2B buyers."
        />
      </Helmet>

      <PageHeader
        eyebrow="Enquire Now"
        heading="Get a Quote"
        description="Fill in your requirements below and we will send you a detailed quotation and product information."
      />

      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            <div className="lg:col-span-2">
              <EnquiryForm
                initialProduct={initialProduct}
                onSubmitted={handleSubmitted}
              />
            </div>

            {/* Sidebar info */}
            <aside className="space-y-4 sm:space-y-5">
              <div className="bg-surface rounded-xl border border-gray-100 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-navy-800 mb-3">What happens next?</h3>
                <ol className="space-y-3">
                  {[
                    'We receive your enquiry and review your requirements.',
                    'Our team prepares a detailed quotation based on your specifications.',
                    'We send you pricing, availability, and shipping options.',
                    'You decide — no obligation, no pressure.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-navy-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-surface rounded-xl border border-gray-100 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-navy-800 mb-2.5">Direct Contact</h3>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Email: </span>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-navy-600 hover:text-navy-800 underline break-all sm:break-normal"
                    >
                      {company.email}
                    </a>
                  </p>
                  {company.phone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Phone: </span>
                      <a
                        href={`tel:${company.phone.replace(/\s+/g, '')}`}
                        className="text-navy-600 hover:text-navy-800"
                      >
                        {company.phone}
                      </a>
                    </p>
                  )}
                  {company.whatsapp && getWhatsAppUrl(company.whatsapp) && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">WhatsApp: </span>
                      <a
                        href={getWhatsAppUrl(company.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:text-green-800 underline"
                      >
                        {company.phone || 'Chat on WhatsApp'}
                      </a>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Location: </span>
                    {company.address.formatted || 'India'}
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-4 inline-block text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  View all contact options →
                </Link>
              </div>
            </aside>

          </div>
        </Container>
      </section>
    </>
  )
}

export default QuotePage
