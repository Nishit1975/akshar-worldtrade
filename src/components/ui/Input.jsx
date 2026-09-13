import { forwardRef } from 'react'

const baseInputClasses = [
  'block w-full rounded border border-gray-200 bg-white',
  'px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400',
  'transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
  'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
].join(' ')

const errorInputClasses = 'border-red-400 focus:ring-red-400 focus:border-red-400'

/**
 * Input — labeled text input with optional error and helper text.
 *
 * @param {string}  label    - visible label above input
 * @param {string}  error    - error message (turns border red)
 * @param {string}  helper   - helper text below input
 * @param {boolean} required - adds asterisk to label
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    helper,
    required = false,
    className = '',
    ...props
  },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        className={[
          baseInputClasses,
          error ? errorInputClasses : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${inputId}-helper`} className="text-xs text-gray-500">
          {helper}
        </p>
      )}
    </div>
  )
})

export default Input
