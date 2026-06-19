import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext.jsx'

// Renders a component inside the app's providers (Router + Language).
// Options:
//   route    - initial router entry (default '/')
//   language - 'nl' | 'en' (default 'nl'); seeded via localStorage, which is
//              what LanguageProvider reads on init.
export function renderWithProviders(ui, { route = '/', language = 'nl' } = {}) {
  localStorage.setItem('language', language)
  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LanguageProvider>{ui}</LanguageProvider>
    </MemoryRouter>,
  )
}
