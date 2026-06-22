import { describe, it, expect } from 'vitest'
import { parseSalary, rangeBounds, filterJobs, sortJobs } from './jobFilters.js'
import { jobs, hoursOptions } from '../../data/jobs.js'

// Convenience: the set of ids a filter returns, order-independent.
const ids = (result) => result.map((j) => j.id).sort((a, b) => a - b)

describe('parseSalary', () => {
  it('extracts [min, max] and strips thousands separators', () => {
    expect(parseSalary('€2.500 - €3.200')).toEqual([2500, 3200])
    expect(parseSalary('€1.800 - €2.300')).toEqual([1800, 2300])
  })

  it('returns [n, n] for a single amount', () => {
    expect(parseSalary('€4.000+')).toEqual([4000, 4000])
  })

  it('returns [0, 0] for an empty or non-numeric label', () => {
    expect(parseSalary('')).toEqual([0, 0])
    expect(parseSalary('on request')).toEqual([0, 0])
  })
})

describe('rangeBounds', () => {
  it('parses a closed range', () => {
    expect(rangeBounds('2000-3000')).toEqual([2000, 3000])
    expect(rangeBounds('0-2')).toEqual([0, 2])
  })

  it('treats a trailing + as an open upper bound', () => {
    expect(rangeBounds('4000+')).toEqual([4000, Infinity])
    expect(rangeBounds('6+')).toEqual([6, Infinity])
  })
})

describe('filterJobs', () => {
  it('returns every job when no criteria are given', () => {
    expect(filterJobs(jobs)).toHaveLength(jobs.length)
    expect(filterJobs(jobs, {})).toHaveLength(jobs.length)
  })

  describe('search', () => {
    it('matches the English title', () => {
      expect(ids(filterJobs(jobs, { search: 'nurse' }))).toEqual([3])
    })

    it('matches text in the description, not just the title', () => {
      // "inventory" only appears in the Warehouse Associate description.
      expect(ids(filterJobs(jobs, { search: 'inventory' }))).toEqual([4])
    })

    it('matches the company name (shared by all jobs)', () => {
      expect(filterJobs(jobs, { search: 'randstad' })).toHaveLength(jobs.length)
    })

    it('is multi-word and order-independent (every term must match)', () => {
      expect(ids(filterJobs(jobs, { search: 'cad designer' }))).toEqual([6])
      expect(ids(filterJobs(jobs, { search: 'designer cad' }))).toEqual([6])
    })

    it('returns nothing when a term matches no job', () => {
      expect(filterJobs(jobs, { search: 'astronaut' })).toEqual([])
    })
  })

  describe('location', () => {
    it('filters by exact city', () => {
      expect(ids(filterJobs(jobs, { location: 'Eindhoven' }))).toEqual([2])
      expect(ids(filterJobs(jobs, { location: 'Rotterdam' }))).toEqual([3, 4])
    })
  })

  describe('salary (range overlap)', () => {
    it('includes jobs whose pay range overlaps the bracket', () => {
      expect(ids(filterJobs(jobs, { salary: '0-2000' }))).toEqual([4, 5, 7])
      // A €2.800–€3.600 role (id 6) overlaps the 3000-4000 bracket.
      expect(ids(filterJobs(jobs, { salary: '3000-4000' }))).toEqual([1, 3, 6, 8])
    })

    it('handles the open-ended top bracket', () => {
      expect(ids(filterJobs(jobs, { salary: '4000+' }))).toEqual([8])
    })
  })

  describe('experience level', () => {
    it('filters by exact level', () => {
      expect(ids(filterJobs(jobs, { level: 'senior' }))).toEqual([1, 6])
      expect(ids(filterJobs(jobs, { level: 'junior' }))).toEqual([4, 5, 7])
    })
  })

  describe('years of experience', () => {
    it('matches jobs whose required years fall in the bracket', () => {
      expect(ids(filterJobs(jobs, { experience: '0-2' }))).toEqual([4, 5, 7])
      expect(ids(filterJobs(jobs, { experience: '3-5' }))).toEqual([2, 3, 6, 8])
      expect(ids(filterJobs(jobs, { experience: '6+' }))).toEqual([1])
    })
  })

  describe('hours per week', () => {
    it('matches the exact contract size (string criterion is coerced)', () => {
      expect(ids(filterJobs(jobs, { hours: '32' }))).toEqual([5])
      expect(ids(filterJobs(jobs, { hours: 36 }))).toEqual([3, 8])
      expect(ids(filterJobs(jobs, { hours: '40' }))).toEqual([1, 4, 6, 7])
    })

    // Regression guard: every selectable hours option must match real data.
    // (A previous edit set the options to values no job had, silently breaking
    // the filter — this asserts the dropdown and the data stay aligned.)
    it('returns at least one job for every selectable hours option', () => {
      for (const option of hoursOptions) {
        expect(filterJobs(jobs, { hours: option }), `hours=${option}`).not.toHaveLength(0)
      }
    })
  })

  describe('combined criteria', () => {
    it('applies all filters together (AND)', () => {
      expect(ids(filterJobs(jobs, { location: 'Amsterdam', level: 'senior' }))).toEqual([1, 6])
      expect(ids(filterJobs(jobs, { location: 'Amsterdam', hours: 36 }))).toEqual([8])
    })

    it('returns nothing when filters are mutually exclusive', () => {
      // The only Eindhoven job is mid-level, so requiring senior yields nothing.
      expect(filterJobs(jobs, { location: 'Eindhoven', level: 'senior' })).toEqual([])
    })
  })
})

describe('sortJobs', () => {
  it('orders by minimum salary ascending', () => {
    const result = sortJobs(jobs, 'salaryAsc')
    expect(result[0].id).toBe(5) // €1.800 min — lowest
    expect(result[result.length - 1].id).toBe(8) // €3.000 min — highest
  })

  it('orders by minimum salary descending', () => {
    const result = sortJobs(jobs, 'salaryDesc')
    expect(result[0].id).toBe(8)
    expect(result[result.length - 1].id).toBe(5)
  })

  it('keeps the original order for "recommended" / unknown modes', () => {
    expect(sortJobs(jobs, 'recommended').map((j) => j.id)).toEqual(jobs.map((j) => j.id))
  })

  it('does not mutate the input array', () => {
    const before = jobs.map((j) => j.id)
    sortJobs(jobs, 'salaryAsc')
    expect(jobs.map((j) => j.id)).toEqual(before)
  })
})
