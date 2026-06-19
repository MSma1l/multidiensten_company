import { useLanguage } from '../../../context/LanguageContext.jsx'
import styles from './QuickStats.module.css'

export default function QuickStats() {
  const { t } = useLanguage()

  return (
    <section className={styles.quickStats}>
      <div className={styles.container}>
        {t.stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.icon}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className={styles.number}>{stat.number}</div>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.text}>{stat.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
