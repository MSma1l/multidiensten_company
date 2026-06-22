import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Carousel.module.css'

// Generic, dependency-free carousel. Lays the items out as horizontal
// scroll-snap slides; arrows scroll one card at a time and dots jump to a card.
// `perView` is the number of cards shown per row on desktop (mobile always
// shows ~one with a peek, via CSS). Controls hide when nothing overflows.
export default function Carousel({ items, renderItem, getKey, perView = 3, ariaLabel, autoPlayMs }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const slideStep = (track) => {
    const slide = track.querySelector(`.${styles.slide}`)
    const gap = parseInt(getComputedStyle(track).columnGap) || 0
    return slide ? slide.offsetWidth + gap : track.clientWidth
  }

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const step = slideStep(track)
    const maxScroll = track.scrollWidth - track.clientWidth
    // One dot per reachable scroll position (depends on how many cards are
    // visible at the current breakpoint), not one per card.
    const pages = step ? Math.round(maxScroll / step) + 1 : 1
    setPageCount(Math.max(1, pages))
    setIndex(step ? Math.min(pages - 1, Math.round(track.scrollLeft / step)) : 0)
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scrollByCard = (dir) => {
    const track = trackRef.current
    track.scrollBy({ left: dir * slideStep(track), behavior: 'smooth' })
  }

  const goTo = (i) => {
    const track = trackRef.current
    track.scrollTo({ left: i * slideStep(track), behavior: 'smooth' })
  }

  // Auto-advance one card on an interval; loop back to the start at the end.
  // Pauses while the pointer is over the carousel.
  useEffect(() => {
    if (!autoPlayMs) return
    const id = setInterval(() => {
      const track = trackRef.current
      if (!track || pausedRef.current) return
      if (track.scrollWidth <= track.clientWidth + 4) return // nothing to scroll
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4
      if (atEnd) track.scrollTo({ left: 0, behavior: 'smooth' })
      else track.scrollBy({ left: slideStep(track), behavior: 'smooth' })
    }, autoPlayMs)
    return () => clearInterval(id)
  }, [autoPlayMs])

  const scrollable = canPrev || canNext

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className={styles.viewport}>
        {scrollable && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}

        <div className={styles.track} ref={trackRef} role="group" aria-label={ariaLabel} style={{ '--per': perView }}>
          {items.map((item, i) => (
            <div className={styles.slide} key={getKey ? getKey(item) : i}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>

        {scrollable && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>

      {scrollable && (
        <div className={styles.dots}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              type="button"
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
