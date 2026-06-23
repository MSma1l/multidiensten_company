import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { cities, levels, experienceRanges, hoursOptions } from '../../data/jobs.js'
import { filterJobs, sortJobs } from './jobFilters.js'
import JobCard from './JobCard.jsx'
import styles from './Jobs.module.css'

// Backend base URL. Production build uses same-origin relative calls (reverse
// proxy); dev uses the standalone backend on :8000 (overridable via env).
const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000')

export default function Jobs() {
  const { t } = useLanguage()
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState('')
  const [experience, setExperience] = useState('')
  const [hours, setHours] = useState('')
  const [sort, setSort] = useState('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Fetch the full job list from the backend on mount. Admins enter jobs
  // manually, so there is no static fallback list any more.
  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(false)
    fetch(`${API_URL}/api/jobs`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!active) return
        setAllJobs(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!active) return
        setLoadError(true)
        setAllJobs([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Client-side filtering of the fetched job list. The actual logic lives in
  // the pure ./jobFilters module (unit-tested there).
  const filtered = useMemo(
    () => sortJobs(filterJobs(allJobs, { search, location, level, experience, hours }), sort),
    [allJobs, search, location, level, experience, hours, sort],
  )

  return (
    <div className={`page ${styles.jobsPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.jobs.title}</h1>
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span className={styles.filtersToggleLabel}>
            <i className="fas fa-sliders"></i>
            {t.jobs.filters}
          </span>
          <i className={`fas fa-chevron-${filtersOpen ? 'up' : 'down'}`}></i>
        </button>

        {filtersOpen && (
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
            <label className={styles.filterLabel} htmlFor="job-level">
              {t.jobs.experienceLevel}
            </label>
            <select
              id="job-level"
              className={styles.select}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">{t.jobs.allLevels}</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {t.jobs.levels[lvl]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-experience">
              {t.jobs.experience}
            </label>
            <select
              id="job-experience"
              className={styles.select}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">{t.jobs.allExperience}</option>
              {experienceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label} {t.jobs.yearsUnit}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-hours">
              {t.jobs.hours}
            </label>
            <select
              id="job-hours"
              className={styles.select}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            >
              <option value="">{t.jobs.allHours}</option>
              {hoursOptions.map((h) => (
                <option key={h} value={h}>
                  {h} {t.jobs.hoursUnit}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="job-sort">
              {t.jobs.sortBy}
            </label>
            <select
              id="job-sort"
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommended">{t.jobs.sortRecommended}</option>
              <option value="salaryDesc">{t.jobs.sortSalaryDesc}</option>
              <option value="salaryAsc">{t.jobs.sortSalaryAsc}</option>
            </select>
          </div>
        </div>
        )}
      </div>

      {loading ? (
        <p className={styles.noResults}>{t.jobs.loading}</p>
      ) : loadError ? (
        <p className={styles.noResults}>{t.jobs.loadError}</p>
      ) : (
        <>
          <p className={styles.resultsCount}>
            {filtered.length} {t.jobs.resultsLabel}
          </p>

          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className={styles.noResults}>
              {allJobs.length === 0 ? t.jobs.empty : t.jobs.noResults}
            </p>
          )}
        </>
      )}
    </div>
  )
}
