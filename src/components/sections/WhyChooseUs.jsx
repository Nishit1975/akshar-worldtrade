import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const reasons = [
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Quality-Focused Sourcing',
    description: 'We work with established suppliers and apply rigorous quality checks to ensure products meet international trade standards before shipment.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Reliable Supply',
    description: 'Consistent product availability backed by well-managed Indian supply chains, helping buyers plan schedules with confidence.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Competitive Pricing',
    description: 'Direct relationships with domestic growers and mills eliminate unnecessary layers, ensuring genuine market pricing.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Professional Documentation',
    description: 'Complete and accurate trade documentation including commercial invoices, packing lists, phytosanitary, and certificates of origin.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Buyer-Focused Service',
    description: 'Responsive trade desk communication and transparent milestone updates from initial RFQ inquiry to final port delivery.',
  },
  {
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Long-Term Partnerships',
    description: 'We prioritize enduring business relationships founded on reliability, honest communication, and mutual commercial trust.',
  },
]

/**
 * WhyChooseUs — modernized six-advantage value proposition grid.
 */
const WhyChooseUs = () => {
  return (
    <section className="bg-surface/50 py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Why choose us">
      <Container>

        <SectionHeading
          label="Our Advantage"
          heading="Why Choose Akshar Worldtrade?"
          description="We combine local agricultural sourcing depth with the rigorous compliance, documentation, and communication that international buyers demand."
          align="center"
          className="mb-6 sm:mb-8 lg:mb-9"
          labelClassName="mb-1 sm:mb-1.5"
          descriptionClassName="mt-1.5 sm:mt-2 text-sm sm:text-base"
          dividerClassName="mt-2.5 sm:mt-3"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {reasons.map(({ icon, title, description }, index) => (
            <div
              key={title}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-navy-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 group-hover:bg-navy-600 group-hover:text-gold-400 flex items-center justify-center transition-all duration-200">
                    {icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-2xs font-semibold text-gold-600 uppercase tracking-wider">
                <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Trade Commitment</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}

export default WhyChooseUs

