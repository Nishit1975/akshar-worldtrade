import Eyebrow from './Eyebrow'

/**
 * PageHeader — consistent hero banner for all interior pages.
 *
 * @param {string} eyebrow     - small uppercase label above heading
 * @param {string} heading     - main h1 text
 * @param {string} description - optional supporting paragraph
 * @param {string} className   - override/extend wrapper classes
 */
const PageHeader = ({ eyebrow, heading, description, className = '' }) => {
  return (
    <section
      className={[
        'bg-surface border-b border-gray-100 py-7 sm:py-8 lg:py-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <Eyebrow className="mb-2 sm:mb-2.5">
            {eyebrow}
          </Eyebrow>
        )}
        <h1 className="text-[1.65rem] sm:text-3xl lg:text-4xl font-bold text-navy-800 leading-tight tracking-tight">
          {heading}
        </h1>
        {description && (
          <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHeader
