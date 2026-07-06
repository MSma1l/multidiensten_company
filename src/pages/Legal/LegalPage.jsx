import { useLanguage } from '../../context/LanguageContext.jsx'
import { legal } from '../../data/legal.js'
import styles from './LegalPage.module.css'

// Renders a legal document (privacy statement or terms) from the structured
// content in src/data/legal.js. `docKey` selects which document; the language
// follows the active site language.
export default function LegalPage({ docKey }) {
  const { language } = useLanguage()
  const doc = legal[language][docKey]

  return (
    <div className={`page ${styles.legalPage}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{doc.title}</h1>
        <p className={styles.updated}>{doc.updated}</p>
        {doc.intro && <p className={styles.intro}>{doc.intro}</p>}

        {doc.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.heading}>{section.heading}</h2>
            {section.blocks.map((block, i) =>
              block.type === 'ul' ? (
                <ul key={i} className={styles.list}>
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className={styles.paragraph}>
                  {block.text}
                </p>
              ),
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
