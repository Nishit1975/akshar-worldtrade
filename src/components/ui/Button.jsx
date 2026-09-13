import { forwardRef } from 'react'

const variantClasses = {
  primary:
    'bg-navy-600 hover:bg-navy-700 active:bg-navy-800 text-white shadow-sm border border-transparent',
  secondary:
    'bg-white hover:bg-navy-50 text-navy-600 border border-navy-200 shadow-sm',
  outline:
    'bg-transparent hover:bg-navy-50 text-navy-600 border border-navy-300',
  ghost:
    'bg-transparent hover:bg-gray-100 text-navy-600 border border-transparent',
  accent:
    'bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white shadow-sm border border-transparent',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent',
  'danger-outline':
    'bg-transparent hover:bg-red-50 text-red-600 border border-red-300',
}

const sizeClasses = {
  sm:  'px-3 py-1.5 text-xs font-medium rounded',
  md:  'px-5 py-2.5 text-sm font-medium rounded',
  lg:  'px-7 py-3 text-base font-medium rounded',
  xl:  'px-8 py-3.5 text-base font-semibold rounded',
}

/**
 * Reusable Button component.
 *
 * @param {string}  variant   - primary | secondary | outline | ghost | accent | danger | danger-outline
 * @param {string}  size      - sm | md | lg | xl
 * @param {boolean} fullWidth - stretch to container width
 * @param {boolean} loading   - shows spinner, disables interaction
 * @param {string}  className - additional Tailwind classes
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    className = '',
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 transition-all duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-600 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
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
      )}
      {children}
    </button>
  )
})

export default Button
