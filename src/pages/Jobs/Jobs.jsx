import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { jobs, cities, salaryRanges } from '../../data/jobs.js'
import JobCard from './JobCard.jsx'
import styles from './Jobs.module.css'

export default function Jobs() {
  const { language, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')

  // Client-side filtering of the static job list (UI only, no backend).
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return jobs.filter((job) => {
      const haystack = `${job.title} ${job.titleEN}`.toLowerCase()
      const matchSearch = haystack.includes(term)
      const matchLocation = !location || job.location === location
      const matchSalary = !salary || job.salaryRange === salary
      return matchSearch && matchLocation && matchSalary
    })
  }, [search, location, salary])

  return (
    <div className={`page ${styles.jobsPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.jobs.title}</h1>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-search">
              {t.jobs.search}
            </label>
            <input
              id="job-search"
              type="text"
              className={styles.input}
              placeholder={t.jobs.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-location">
              {t.jobs.location}
            </label>
            <select
              id="job-location"
              className={styles.select}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">{t.jobs.allCities}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-salary">
              {t.jobs.salary}
            </label>
            <select
              id="job-salary"
              className={styles.select}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            >
              <option value="">{t.jobs.allSalaries}</option>
              {salaryRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>{t.jobs.noResults}</p>
      )}
    </div>
  )
}
