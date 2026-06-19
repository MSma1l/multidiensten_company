import { useLanguage } from '../../../context/LanguageContext.jsx'
import Button from '../../../components/Button/Button.jsx'
import styles from './Hero.module.css'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t.hero.title}</h1>
        <p className={styles.subtitle}>{t.hero.subtitle}</p>
        <div className={styles.buttons}>
          <Button to="/jobs" variant="primary">
            {t.hero.browse}
          </Button>
          <Button to="/contact" variant="secondary">
            {t.hero.apply}
          </Button>
        </div>
      </div>
    </section>
  )
}
