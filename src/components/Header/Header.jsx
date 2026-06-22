import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import styles from './Header.module.css'

export default function Header() {
  const { language, setLanguage, t } = useLanguage()
  // Mobile-only: the nav/lang panel is collapsed behind a hamburger toggle.
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/jobs', label: t.nav.jobs },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          RANDSTAD
        </Link>

        <nav className={`${styles.navButtons} ${menuOpen ? styles.open : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
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

        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className={menuOpen ? 'fas fa-xmark' : 'fas fa-bars'}></i>
        </button>
      </div>
    </header>
  )
}
