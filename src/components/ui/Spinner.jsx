/**
 * Spinner — animated loading indicator.
 *
 * @param {string} size    - xs | sm | md | lg | xl
 * @param {string} color   - 'navy' (default) | 'white' | 'gold' | 'gray'
 * @param {string} label   - screen-reader label (default: 'Loading…')
 * @param {string} className
 */
const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const colorClasses = {
  navy:  'text-navy-600',
  white: 'text-white',
  gold:  'text-gold-500',
  gray:  'text-gray-400',
}

const Spinner = ({
  size = 'md',
  color = 'navy',
  label = 'Loading…',
  className = '',
}) => {
  return (
    <span role="status" aria-label={label} className={['inline-block', className].filter(Boolean).join(' ')}>
      <svg
        className={[
          'animate-spin',
          sizeClasses[size] ?? sizeClasses.md,
          colorClasses[color] ?? colorClasses.navy,
        ].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Spinner
