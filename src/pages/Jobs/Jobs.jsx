import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { jobs, cities, levels, experienceRanges, hoursOptions } from '../../data/jobs.js'
import { filterJobs, sortJobs } from './jobFilters.js'
import JobCard from './JobCard.jsx'
import styles from './Jobs.module.css'

export default function Jobs() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState('')
  const [experience, setExperience] = useState('')
  const [hours, setHours] = useState('')
  const [sort, setSort] = useState('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Client-side filtering of the static job list (UI only, no backend).
  // The actual logic lives in the pure ./jobFilters module (unit-tested there).
  const filtered = useMemo(
    () => sortJobs(filterJobs(jobs, { search, location, level, experience, hours }), sort),
    [search, location, level, experience, hours, sort],
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
        <p className={styles.noResults}>{t.jobs.noResults}</p>
      )}
    </div>
  )
}
