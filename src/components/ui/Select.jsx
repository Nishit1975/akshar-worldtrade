import { forwardRef } from 'react'

/**
 * Select — styled dropdown matching Input/Textarea visual system.
 *
 * @param {string}   label    - visible label
 * @param {string}   error    - error message
 * @param {string}   helper   - helper text
 * @param {boolean}  required - asterisk on label
 * @param {string}   placeholder - default empty option text
 * @param {Array}    options  - [{ value, label }] or string[]
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    error,
    helper,
    required = false,
    placeholder = 'Select an option',
    options = [],
    className = '',
    ...props
  },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={[
            'block w-full rounded border border-gray-200 bg-white',
            'px-3.5 py-2.5 pr-10 text-base sm:text-sm text-gray-900',
            'appearance-none transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value
            const label = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={value} value={value}>
                {label}
              </option>
            )
          })}
        </select>

        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

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

export default Select
