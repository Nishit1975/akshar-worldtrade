/**
 * Container — standard max-width wrapper with responsive horizontal padding.
 *
 * @param {string} size      - sm | md | lg | xl (default) | full
 * @param {string} className - additional classes
 */
const sizeClasses = {
  sm:   'max-w-3xl',
  md:   'max-w-5xl',
  lg:   'max-w-6xl',
  xl:   'max-w-7xl',
  full: 'max-w-full',
}

const Container = ({ children, size = 'xl', className = '', ...props }) => {
  return (
    <div
      className={[
        sizeClasses[size] ?? sizeClasses.xl,
        'mx-auto px-4 sm:px-6 lg:px-8',
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

export default Container
