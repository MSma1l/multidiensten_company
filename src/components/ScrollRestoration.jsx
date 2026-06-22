import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Remembers the scroll position of each history entry (keyed by location.key)
// so that pressing "back" returns you to where you left the previous page,
// while navigating forward to a new page still starts at the top.
const positions = new Map()

export default function ScrollRestoration() {
  const { key } = useLocation()
  const navigationType = useNavigationType()

  // Take over scroll handling from the browser so it doesn't fight us.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Continuously record the scroll position for the current history entry, and
  // capture a final value when leaving it (cleanup runs before the next entry).
  useEffect(() => {
    const save = () => positions.set(key, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      save()
      window.removeEventListener('scroll', save)
    }
  }, [key])

  // On back/forward (POP) restore the saved position; otherwise go to the top.
  // useLayoutEffect runs before paint, avoiding a visible jump.
  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      window.scrollTo(0, positions.get(key) ?? 0)
    } else {
      window.scrollTo(0, 0)
    }
  }, [key, navigationType])

  return null
}
