import { useLanguage } from '../../../context/LanguageContext.jsx'
import Button from '../../../components/Button/Button.jsx'
import styles from './About.module.css'

// Splits `text` around `highlight` and wraps the matched part in a styled span.
function withHighlight(text, highlight, className) {
  if (!highlight) return text
  const index = text.indexOf(highlight)
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <strong className={className}>{highlight}</strong>
      {text.slice(index + highlight.length)}
    </>
  )
}

export default function About() {
  const { t } = useLanguage()
  const a = t.about

  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{a.title}</h2>

          <p className={styles.paragraph}>
            {withHighlight(a.paragraph1, a.highlight1, styles.highlight)}
          </p>

          <p className={`${styles.paragraph} ${styles.small}`}>
            {withHighlight(a.paragraph2, a.highlight2, styles.boldText)}
          </p>

          <div className={styles.buttons}>
            <Button to="/jobs" variant="accent">
              {a.findRole} <i className="fas fa-arrow-right"></i>
            </Button>
            <Button to="/contact" variant="secondary">
              {a.talkToUs} <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>

        <div className={styles.image}>
          <img src="/about.jpg" alt={a.title} />
        </div>
      </div>
    </section>
  )
}
