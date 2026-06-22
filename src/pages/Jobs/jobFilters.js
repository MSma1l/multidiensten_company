// Pure, UI-side filtering & sorting logic for the Jobs page.
// No React, no DOM — every function here is a plain transform over the static
// job list, which makes the behaviour straightforward to unit test.

// Pull the numeric [min, max] out of a salary label like "€2.500 - €3.200".
// Dots are thousands separators, so they're stripped before parsing. A label
// with a single amount yields [n, n]; an empty/garbage label yields [0, 0].
export function parseSalary(label) {
  const nums = (String(label).replace(/\./g, '').match(/\d+/g) || []).map(Number)
  const min = nums[0] ?? 0
  const max = nums[1] ?? min
  return [min, max]
}

// Bounds for a range option value: "2000-3000" -> [2000, 3000],
// "6+" -> [6, Infinity]. Used for both salary brackets and years-of-experience.
export function rangeBounds(value) {
  if (value.endsWith('+')) return [Number(value.slice(0, -1)), Infinity]
  const [lo, hi] = value.split('-').map(Number)
  return [lo, hi]
}

// Returns the jobs that match every active criterion. Empty / falsy criteria
// are treated as "no filter". `criteria` keys: search, location, salary,
// level, experience, hours — all optional.
export function filterJobs(jobs, criteria = {}) {
  const { search = '', location = '', salary = '', level = '', experience = '', hours = '' } =
    criteria

  // Multi-word search: each term must appear somewhere in the job's text.
  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const [lo, hi] = salary ? rangeBounds(salary) : [0, Infinity]
  const [expLo, expHi] = experience ? rangeBounds(experience) : [0, Infinity]

  return jobs.filter((job) => {
    const haystack =
      `${job.title} ${job.titleEN} ${job.desc} ${job.descEN} ${job.company} ${job.location}`.toLowerCase()
    const matchSearch = terms.every((term) => haystack.includes(term))
    const matchLocation = !location || job.location === location

    // A job matches a salary bracket when its pay range overlaps it, so a
    // €2.800–€3.600 role surfaces under both the 2000-3000 and 3000-4000 filters.
    const [jMin, jMax] = parseSalary(job.salary)
    const matchSalary = !salary || (jMin <= hi && jMax >= lo)

    const matchLevel = !level || job.level === level
    const matchExperience =
      !experience || (job.experienceYears >= expLo && job.experienceYears <= expHi)
    const matchHours = !hours || job.hoursPerWeek === Number(hours)

    return matchSearch && matchLocation && matchSalary && matchLevel && matchExperience && matchHours
  })
}

// Returns a new array sorted by the given mode. 'salaryAsc' / 'salaryDesc'
// order by the job's minimum salary; anything else keeps the original order.
export function sortJobs(jobs, sort) {
  if (sort !== 'salaryAsc' && sort !== 'salaryDesc') return [...jobs]
  const dir = sort === 'salaryAsc' ? 1 : -1
  return [...jobs].sort((a, b) => (parseSalary(a.salary)[0] - parseSalary(b.salary)[0]) * dir)
}
