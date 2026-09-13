import Container from '../ui/Container'

const pillars = [
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Quality Assurance',
    description: 'Carefully sourced products that meet international quality and food safety standards.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    title: 'Reliable Supply',
    description: 'Consistent product availability supported by established supplier networks across India.',
  },
  {
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Professional Documentation',
    description: 'Complete trade documentation including invoices, certificates, and export compliance support.',
  },
]

/**
 * TrustSection — company introduction immediately below hero.
 */
const TrustSection = () => {
  return (
    <section className="bg-surface py-16 lg:py-20" aria-label="About Akshar Worldtrade">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — narrative text */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold-600 mb-4">
              Our Approach
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 leading-tight tracking-tight mb-5">
              A Reliable Partner for Global Trade
            </h2>
            <div className="h-0.5 w-10 bg-gold-500 rounded-full mb-6" aria-hidden="true" />
            <p className="text-gray-600 leading-relaxed mb-4">
              Akshar Worldtrade is committed to connecting international buyers with quality products sourced responsibly from across India. We understand that global trade demands more than just competitive pricing — it requires trust, consistency, and professional communication at every step.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are a first-time importer or an established distributor, we are structured to support your requirements with the attention and professionalism your business deserves.
            </p>
          </div>

          {/* Right — three pillars */}
          <div className="flex flex-col gap-6">
            {pillars.map(({ icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-shrink-0 h-11 w-11 rounded bg-navy-50 flex items-center justify-center text-navy-600">
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}

export default TrustSection
