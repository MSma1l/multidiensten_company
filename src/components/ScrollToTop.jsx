import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls back to the top whenever the route changes — mirrors the original
// `window.scrollTo(0, 0)` on page navigation.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
