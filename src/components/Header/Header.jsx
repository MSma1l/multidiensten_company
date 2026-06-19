import { Link, NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import styles from './Header.module.css'

export default function Header() {
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/jobs', label: t.nav.jobs },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          RANDSTAD
        </Link>

        <div className={styles.right}>
          <nav className={styles.navButtons}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.navBtn} ${styles.active}` : styles.navBtn
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.langSwitcher}>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'nl' ? styles.langActive : ''}`}
              onClick={() => setLanguage('nl')}
            >
              NL
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'en' ? styles.langActive : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
