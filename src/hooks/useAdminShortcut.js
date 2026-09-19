import { useEffect } from 'react'

/**
 * Global keyboard shortcut hook:
 * Pressing Ctrl + Shift + A (or Cmd + Shift + A on macOS) opens the Admin Panel (/admin) in a new browser tab.
 * 
 * - Ignores shortcut when user is typing in inputs, textareas, selects, or contenteditable areas.
 * - Ignores shortcut if modifier keys other than Ctrl/Cmd + Shift are present.
 * - Prevents default browser action when triggered.
 * - Resolves relative route /admin against current site origin.
 */
export function useAdminShortcut() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Trigger only on Ctrl + Shift + A (or Cmd + Shift + A) without Alt
      const isCtrlOrCmd = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey
      const isAlt = event.altKey
      const isKeyA = event.key?.toLowerCase() === 'a'

      if (isCtrlOrCmd && isShift && !isAlt && isKeyA) {
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
