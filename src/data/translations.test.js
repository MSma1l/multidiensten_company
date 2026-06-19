import { describe, it, expect } from 'vitest'
import { translations } from './translations.js'

// Recursively collects the "shape" of an object: dotted key paths, with array
// items keyed by index. Lets us assert NL and EN expose identical structures.
function shapeOf(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => shapeOf(item, `${prefix}[${i}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, v]) =>
      shapeOf(v, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

describe('translations', () => {
  it('supports both nl and en', () => {
    expect(Object.keys(translations).sort()).toEqual(['en', 'nl'])
  })

  it('exposes an identical key structure for nl and en', () => {
    expect(shapeOf(translations.nl).sort()).toEqual(shapeOf(translations.en).sort())
  })

  for (const lang of ['nl', 'en']) {
    describe(`[${lang}]`, () => {
      const t = translations[lang]

      it('has 4 stats, 6 features and 3 testimonials', () => {
        expect(t.stats).toHaveLength(4)
        expect(t.features.items).toHaveLength(6)
        expect(t.testimonials.items).toHaveLength(3)
      })

      it('keeps about highlights as exact substrings of their paragraphs', () => {
        // The About section splits paragraphs on these substrings to bold them,
        // so a mismatch would silently drop the highlight styling.
        expect(t.about.paragraph1).toContain(t.about.highlight1)
        expect(t.about.paragraph2).toContain(t.about.highlight2)
      })

      it('has a non-empty message for every contact error key', () => {
        for (const [key, message] of Object.entries(t.contact.errors)) {
          expect(message, `${lang}.${key}`).toBeTruthy()
        }
      })
    })
  }
})
