import { useLanguage } from '../../context/LanguageContext.jsx'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.column}>
          <h3>{t.footer.aboutTitle}</h3>
          <p>{t.footer.aboutText}</p>
        </div>

        <div className={styles.column}>
          <h3>{t.footer.contactTitle}</h3>
          <p>info@randstad.nl</p><br />
          <p>+31 30 202 0202</p><br />
          <p>Slotlaan 314 B, 3701GX Zeist</p>
        </div>

        <div className={styles.column}>
          <h3>{t.footer.socialTitle}</h3>
          <p>
            <a href="#">LinkedIn</a>
          </p><br />
          <p>
            <a href="#">Facebook</a>
          </p><br />
          <p>
            <a href="#">Instagram</a>
          </p>
        </div>

        <div className={styles.column}>
          <h3>{t.footer.linksTitle}</h3>
          <p>
            <a href="#">{t.footer.privacy}</a>
          </p><br />
          <p>
            <a href="#">{t.footer.terms}</a>
          </p><br />
          <p>
            <a href="#">{t.footer.sitemap}</a>
          </p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          &copy; 2026 Randstad. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
