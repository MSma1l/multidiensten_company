import { useLanguage } from '../../../context/LanguageContext.jsx'
import SectionHeader from '../../../components/SectionHeader/SectionHeader.jsx'
import styles from './Features.module.css'

export default function Features() {
  const { t } = useLanguage()

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />

        <div className={styles.grid}>
          {t.features.items.map((feature) => (
            <div key={feature.title} className={styles.card}>
              <div className={styles.icon}>
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
