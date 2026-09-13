import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    step: '01',
    title: 'Origin Sourcing',
    desc: 'Direct procurement from verified Indian agricultural growers, mills, and producers with transparent lot traceability.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Quality Assessment',
    desc: 'Physical grading, moisture analysis, cleanliness verification, and sorting to ensure adherence to buyer specifications.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Export Packaging',
    desc: 'Bespoke packing in food-grade PP bags, jute sacks, or custom containerized bulk packaging with buyer branding.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Documentation & Shipment',
    desc: 'Full customs documentation, phytosanitary checks, certificate of origin issuance, and container port dispatch.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
]

/**
 * ExportWorkflow — 4-step modern process timeline for B2B trade execution.
 */
const ExportWorkflow = () => {
  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="How we work">
      <Container>

        <SectionHeading
          label="Process & Execution"
          heading="How We Manage Export Shipments"
          description="A structured four-phase workflow ensuring product compliance, accurate documentation, and dependable port dispatch from India."
          align="center"
          className="mb-5 sm:mb-7 lg:mb-8"
          labelClassName="mb-1 sm:mb-1.5"
          descriptionClassName="mt-1.5 sm:mt-2 text-sm sm:text-base"
          dividerClassName="mt-2.5 sm:mt-3"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map(({ step, title, desc, icon }) => (
            <div
              key={step}
              className="relative group bg-surface/60 rounded-2xl p-4 sm:p-5 lg:p-5 border border-slate-200/80 hover:bg-white hover:border-navy-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-navy-700 group-hover:bg-navy-700 group-hover:text-gold-400 group-hover:border-navy-700 flex items-center justify-center shadow-2xs transition-all duration-200">
                    {icon}
                  </div>
                  <span className="text-sm font-extrabold text-gold-600 bg-gold-50/80 px-2.5 py-1 rounded-lg border border-gold-200/60">
                    {step}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-navy-900 group-hover:text-navy-700 transition-colors mb-1.5">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-navy-700 transition-colors">
                <span>Phase {step}</span>
                <span className="text-gold-500">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}

export default ExportWorkflow
