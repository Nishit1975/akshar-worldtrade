/**
 * Badge — small semantic label pill.
 *
 * @param {string} variant - default | navy | gold | success | warning | danger | info | published | draft
 * @param {string} size    - sm | md
 */
const variantClasses = {
  default:   'bg-gray-100 text-gray-600',
  navy:      'bg-navy-50 text-navy-700',
  gold:      'bg-gold-100 text-gold-700',
  success:   'bg-green-50 text-green-700',
  warning:   'bg-amber-50 text-amber-700',
  danger:    'bg-red-50 text-red-700',
  info:      'bg-blue-50 text-blue-700',
  published: 'bg-green-50 text-green-700',
  draft:     'bg-gray-100 text-gray-500',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant] ?? variantClasses.default,
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

export default Badge
