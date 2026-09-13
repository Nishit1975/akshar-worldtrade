/**
 * SectionHeading — consistent section title block used across all public pages.
 *
 * Structure:
 *   [SMALL UPPERCASE LABEL]
 *   Heading Text
 *   Optional description paragraph
 *   ── gold accent line ──
 *
 * @param {string} label       - small uppercase colored label (optional)
 * @param {string} heading     - main h2 heading
 * @param {string} description - supporting paragraph (optional)
 * @param {string} align       - 'left' | 'center'
 * @param {string} headingSize - 'xl' | '2xl' | '3xl' | '4xl' (default '3xl')
 * @param {string} className   - wrapper class extension
 */
const SectionHeading = ({
  label,
  heading,
  description,
  align = 'center',
  headingSize = '3xl',
  className = '',
  labelClassName = '',
  descriptionClassName = '',
  dividerClassName = '',
}) => {
  const isCenter = align === 'center'

  const headingSizeClasses = {
    xl:   'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-[1.65rem] sm:text-3xl lg:text-4xl',
    '4xl': 'text-3xl sm:text-4xl lg:text-5xl',
  }

  return (
    <div className={[isCenter ? 'text-center' : 'text-left', className].filter(Boolean).join(' ')}>
      {label && (
        <span
          className={[
            'inline-block text-xs font-semibold tracking-widest uppercase text-gold-600',
            labelClassName || 'mb-2.5 sm:mb-3',
          ].join(' ')}
        >
          {label}
        </span>
      )}

      <h2
        className={[
          'font-bold text-navy-800 leading-tight tracking-tight',
          headingSizeClasses[headingSize] ?? headingSizeClasses['3xl'],
        ].join(' ')}
      >
        {heading}
      </h2>

      {description && (
        <p
          className={[
            'text-gray-500 leading-relaxed',
            descriptionClassName || 'mt-3 sm:mt-4 text-[15px] sm:text-base lg:text-lg',
            isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          ].join(' ')}
        >
          {description}
        </p>
      )}

      {/* Gold accent divider */}
      <div
        className={[
          'h-0.5 w-10 bg-gold-500 rounded-full',
          dividerClassName || 'mt-5',
          isCenter ? 'mx-auto' : '',
        ].join(' ')}
        aria-hidden="true"
      />
    </div>
  )
}

export default SectionHeading
