/**
 * Card — white surface with subtle border and optional shadow.
 *
 * @param {string}  padding  - none | sm | md | lg
 * @param {boolean} hover    - adds lift effect on hover
 * @param {boolean} bordered - shows border (default true)
 * @param {string}  className
 */
const Card = ({
  children,
  padding = 'md',
  hover = false,
  bordered = true,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  }

  return (
    <div
      className={[
        'bg-white rounded-lg',
        bordered ? 'border border-gray-100' : '',
        'shadow-sm',
        hover
          ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : '',
        paddingClasses[padding] ?? paddingClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
