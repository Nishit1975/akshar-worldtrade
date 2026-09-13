import { useState } from 'react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const faqs = [
  {
    q: 'What product categories does Akshar Worldtrade export?',
    a: 'We specialize in Indian agricultural commodities and milling products, including Grains & Cereals (Basmati and Non-Basmati rice, wheat), Milling Flours, and Spices & Seasonings, sourced directly from verified Indian producers.',
  },
  {
    q: 'What are your Minimum Order Quantities (MOQ)?',
    a: 'We accommodate both commercial trial shipments and full container load (FCL) orders depending on the product type and destination market. Contact our sales desk with your target product for specific container capacities.',
  },
  {
    q: 'What export documentation do you provide for customs clearance?',
    a: 'Every export consignment includes a complete set of trade documents: Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, and Phytosanitary Certificate where mandated by the destination country.',
  },
  {
    q: 'Can you provide customized packaging and buyer labeling?',
    a: 'Yes. We offer packaging solutions tailored to buyer requirements, including 25kg or 50kg PP bags, bulk container liners, and customized private labeling for international retail or wholesale distribution.',
  },
  {
    q: 'How can international buyers obtain a formal quotation?',
    a: 'You can submit your requirements through our online Request a Quote form, email our trade desk directly at aksharworldtrade@gmail.com, or message us via WhatsApp for rapid correspondence.',
  },
]

/**
 * HomeFAQ — modern clean accordion answering common B2B export buyer queries.
 */
const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex((current) => (current === idx ? -1 : idx))
  }

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Frequently asked questions">
      <Container size="lg">

        <SectionHeading
          label="Buyer Questions"
          heading="Frequently Asked Questions"
          description="Essential information regarding sourcing, order volumes, documentation, and international shipping."
          align="center"
          className="mb-5 sm:mb-6 lg:mb-7"
          labelClassName="mb-1 sm:mb-1.5"
          descriptionClassName="mt-1.5 sm:mt-2 text-sm sm:text-base"
          dividerClassName="mt-2.5 sm:mt-3"
        />

        <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          {faqs.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={q}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-navy-300 shadow-xs'
                    : 'bg-surface/60 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 min-h-[46px] sm:min-h-[48px] flex items-center justify-between text-left gap-3 sm:gap-4 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] sm:text-base font-bold text-navy-900 leading-snug">
                    {q}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-navy-600 text-white rotate-180' : 'bg-white border border-slate-200 text-navy-700'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-3.5 sm:pb-4 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </Container>
    </section>
  )
}

export default HomeFAQ
