import { useLanguage } from '../../../context/LanguageContext.jsx'
import Button from '../../../components/Button/Button.jsx'
import styles from './CTABlock.module.css'

export default function CTABlock() {
  const { t } = useLanguage()

  return (
    <section className={styles.block}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t.cta.title}</h2>
        <p className={styles.subtitle}>{t.cta.subtitle}</p>
        <div className={styles.buttons}>
          <Button to="/jobs" variant="blockAccent" size="lg">
            {t.cta.discover}
          </Button>
          <Button to="/contact" variant="blockOutline" size="lg">
            {t.cta.submitCv}
          </Button>
        </div>
      </div>
    </section>
  )
}
