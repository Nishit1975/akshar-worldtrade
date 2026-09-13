/**
 * EmptyState — centered placeholder for empty lists or missing data.
 *
 * @param {React.ReactNode} icon        - icon element (optional)
 * @param {string}          title       - main message
 * @param {string}          description - supporting text
 * @param {React.ReactNode} action      - CTA button or link
 * @param {string}          className
 */
const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <div className="mb-4 text-gray-300 flex items-center justify-center">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState
