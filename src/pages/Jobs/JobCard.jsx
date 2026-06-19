import { useLanguage } from '../../context/LanguageContext.jsx'
import Button from '../../components/Button/Button.jsx'
import styles from './JobCard.module.css'

export default function JobCard({ job }) {
  const { language, t } = useLanguage()
  const isEN = language === 'en'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{isEN ? job.titleEN : job.title}</h3>
        <p className={styles.company}>{job.company}</p>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <i className="fas fa-map-marker-alt"></i>
          <span>{job.location}</span>
        </div>
        <div className={styles.metaItem}>
          <i className="fas fa-briefcase"></i>
          <span>{t.jobs.fullTime}</span>
        </div>
      </div>

      <div className={styles.salary}>{job.salary}</div>
      <p className={styles.desc}>{isEN ? job.descEN : job.desc}</p>

      <Button to="/contact" variant="gradient" className={styles.button}>
        {t.jobs.apply}
      </Button>
    </div>
  )
}
