import { useLanguage } from '../../context/LanguageContext.jsx'
import Button from '../../components/Button/Button.jsx'
import styles from './JobCard.module.css'

export default function JobCard({ job }) {
  const { language, t } = useLanguage()
  const isEN = language === 'en'

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{isEN ? job.titleEN : job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>
        <div className={styles.salary}>{job.salary}</div>
      </div>

      <div className={styles.tags}>
        <span className={styles.tag}>
          <i className="fas fa-map-marker-alt"></i>
          {job.location}
        </span>
        <span className={styles.tag}>
          <i className="fas fa-clock"></i>
          {job.hoursPerWeek} {t.jobs.hoursUnit}
        </span>
        <span className={styles.tag}>
          <i className="fas fa-user-tie"></i>
          {t.jobs.levels[job.level]}
        </span>
        <span className={styles.tag}>
          <i className="fas fa-briefcase"></i>
          {job.experienceYears}+ {t.jobs.yearsUnit}
        </span>
      </div>

      <p className={styles.desc}>{isEN ? job.descEN : job.desc}</p>

      <Button to="/contact" variant="gradient" className={styles.button}>
        {t.jobs.apply}
      </Button>
    </div>
  )
}
