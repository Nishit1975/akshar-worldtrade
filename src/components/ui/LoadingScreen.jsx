import { useState, useEffect, useRef } from 'react'
import logo from '../../assets/logo.png'

/**
 * LoadingScreen
 *
 * Displays a full-viewport branded loading experience ONLY on the very first
 * page-load of the session.  It uses sessionStorage so that SPA navigation
 * (React Router) never re-triggers it, and it never interferes with Supabase
 * auth or the admin panel.
 *
 * Accessibility: respects prefers-reduced-motion — when the user has opted out
 * of motion the screen is skipped entirely (or shown without animation).
 */

const SESSION_KEY = 'akshar_loaded'

/* Duration (ms) for the progress bar to fill to 100 % */
const PROGRESS_DURATION = 1400

/* How long the exit fade-out takes (ms) — matches CSS transition */
const FADE_DURATION = 500

const LoadingScreen = ({ children }) => {
  // Has the user already seen the loader this session?
  const alreadyLoaded = typeof window !== 'undefined'
    ? sessionStorage.getItem(SESSION_KEY) === '1'
    : true

  // Respect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // If already loaded or motion is reduced → skip loader entirely
  const shouldSkip = alreadyLoaded || prefersReduced

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(!shouldSkip)
  const [exiting, setExiting] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (shouldSkip) return

    const startProgress = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const pct = Math.min((elapsed / PROGRESS_DURATION) * 100, 100)
      setProgress(pct)

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(startProgress)
      } else {
        // Begin exit fade
        setExiting(true)
        setTimeout(() => {
          setVisible(false)
          sessionStorage.setItem(SESSION_KEY, '1')
        }, FADE_DURATION)
      }
    }

    rafRef.current = requestAnimationFrame(startProgress)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [shouldSkip])

  return (
    <>
      {visible && (
        <div
          className={`akshar-loader${exiting ? ' akshar-loader--exit' : ''}`}
          role="status"
          aria-label="Loading Akshar Worldtrade"
          aria-live="polite"
        >
          {/* Decorative corner accents */}
          <span className="akshar-loader__corner akshar-loader__corner--tl" aria-hidden="true" />
          <span className="akshar-loader__corner akshar-loader__corner--br" aria-hidden="true" />

          <div className="akshar-loader__inner">
            {/* Logo */}
            <div className="akshar-loader__logo-wrap">
              <img
                src={logo}
                alt="Akshar Worldtrade"
                className="akshar-loader__logo"
                draggable="false"
              />
            </div>

            {/* LOADING label */}
            <p className="akshar-loader__label" aria-hidden="true">
              LOADING
            </p>

            {/* Progress track */}
            <div
              className="akshar-loader__track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="akshar-loader__bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Percentage */}
            <span className="akshar-loader__pct" aria-hidden="true">
              {Math.round(progress)}%
            </span>

            {/* Tagline */}
            <p className="akshar-loader__tagline" aria-hidden="true">
              Connecting India with the World
            </p>
          </div>
        </div>
      )}

      {/* Always render children so React can hydrate in the background */}
      <div
        style={visible ? { visibility: 'hidden', position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' } : undefined}
        aria-hidden={visible ? 'true' : undefined}
      >
        {children}
      </div>
    </>
  )
}

export default LoadingScreen
