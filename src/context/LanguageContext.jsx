import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../data/translations.js'

const LanguageContext = createContext(null)

const SUPPORTED = ['nl', 'en']

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return SUPPORTED.includes(saved) ? saved : 'nl'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      // Translation dictionary for the active language.
      t: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
