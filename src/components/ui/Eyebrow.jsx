/**
 * Eyebrow — standardized hero eyebrow pill component for public pages.
 *
 * Design features:
 * - Rounded pill container (rounded-full)
 * - Light navy neutral background (bg-navy-50/90)
 * - Subtle light border (border border-navy-100/90)
 * - Small circular gold dot on the left (h-2 w-2 rounded-full bg-gold-500)
 * - Navy uppercase text (text-navy-800 uppercase tracking-widest font-bold)
 * - Responsive compact sizing (text-[11px] sm:text-xs px-3 py-1 sm:px-3.5 sm:py-1.5)
 * - Subtle shadow & backdrop blur (shadow-2xs backdrop-blur-xs)
 *
 * @param {React.ReactNode} children - Eyebrow label text
 * @param {string} [className] - Optional extra wrapper classes
 */
const Eyebrow = ({ children, className = '' }) => {
  if (!children) return null

  return (
    <div
      className={[
        'inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-navy-50/90 border border-navy-100/90 text-navy-800 shadow-2xs w-fit backdrop-blur-xs max-w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="inline-block h-2 w-2 rounded-full bg-gold-500 shadow-xs shadow-gold-500/40 shrink-0"
        aria-hidden="true"
      />
      <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-navy-800 truncate sm:whitespace-normal">
        {children}
      </span>
    </div>
  )
}

export default Eyebrow
