import { useEffect } from 'react'

/**
 * Global keyboard shortcut hook:
 * Pressing Ctrl + N opens the Admin Panel (/admin) in a new browser tab.
 * 
 * - Ignores shortcut when user is typing in inputs, textareas, selects, or contenteditable areas.
 * - Prevents default browser action where allowed.
 * - Resolves relative route /admin against current site origin.
 */
export function useAdminShortcut() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + N (or Cmd + N on macOS) without Alt or Shift
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key?.toLowerCase() === 'n') {
        const target = event.target
        const activeEl = document.activeElement

        const isEditable = (el) => {
          if (!el) return false
          const tag = el.tagName?.toUpperCase()
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) {
            return true
          }
          if (typeof el.closest === 'function') {
            return Boolean(el.closest('input, textarea, select, [contenteditable="true"]'))
          }
          return false
        }

        if (isEditable(target) || isEditable(activeEl)) {
          return
        }

        event.preventDefault()
        window.open(`${window.location.origin}/admin`, '_blank')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

export default useAdminShortcut
