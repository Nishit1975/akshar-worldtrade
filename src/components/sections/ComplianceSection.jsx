import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const complianceDocs = [
  {
    code: 'IEC',
    title: 'Import-Export Code (IEC)',
    desc: 'Registered commercial exporter credential issued by the Directorate General of Foreign Trade (DGFT), Government of India.',
    type: 'Statutory License',
    status: 'Relevant Registration',
  },
  {
    code: 'FSSAI',
    title: 'Food Safety Compliance (FSSAI)',
    desc: 'Adherence to standards established by the Food Safety and Standards Authority of India for safe commodity and food exports.',
    type: 'Food Safety Benchmark',
    status: 'Applicable Requirement',
  },
  {
    code: 'PHYTO',
    title: 'Phytosanitary Certification',
    desc: 'Government inspection and quarantine certification validating plant and agricultural health per destination import rules.',
    type: 'Per-Shipment Inspection',
    status: 'Available on Request',
  },
  {
    code: 'COO',
    title: 'Certificate of Origin',
    desc: 'Official document certifying goods are manufactured and processed in India, facilitating customs clearance.',
    type: 'Origin Verification',
    status: 'Available on Request',
  },
]

/**
 * ComplianceSection — trade documentation & export regulatory framework.
 * Transparent, verifiable, and strictly truthful (no fake logos).
 */
const ComplianceSection = () => {
  return (
    <section className="bg-surface/50 py-8 sm:py-10 lg:py-14 border-b border-gray-100" aria-label="Trade compliance">
      <Container>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-5 sm:mb-7 lg:mb-8">
          <SectionHeading
            label="Compliance & Standards"
            heading="Export Regulatory Compliance"
            description="Our export operations align with statutory Indian trade regulations and international consignment requirements."
            align="left"
            className="sm:max-w-xl"
            labelClassName="mb-1 sm:mb-1.5"
            descriptionClassName="mt-1.5 sm:mt-2 text-sm sm:text-base"
            dividerClassName="mt-2.5 sm:mt-3"
          />
          <Link
            to="/certifications"
            className="group flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-800 transition-colors"
          >
            <span>Review Full Compliance Overview</span>
            <svg className="h-4 w-4 transform transition-transform duration-150 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {complianceDocs.map(({ code, title, desc, type, status }) => (
            <div
              key={code}
              className="group bg-white rounded-2xl p-4 sm:p-5 lg:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-navy-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs font-extrabold uppercase tracking-widest text-navy-700 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100">
                    {code}
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700 transition-colors mb-1.5 leading-snug">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400 font-medium">
                <span>{type}</span>
                <span className="text-navy-700 font-semibold">{status}</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}

export default ComplianceSection
