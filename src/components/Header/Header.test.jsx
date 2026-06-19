import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import Header from './Header.jsx'

describe('Header', () => {
  it('renders Dutch navigation by default', () => {
    renderWithProviders(<Header />, { language: 'nl' })
    expect(screen.getByRole('link', { name: 'Vacatures' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('switches navigation labels to English when EN is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />, { language: 'nl' })

    await user.click(screen.getByRole('button', { name: 'EN' }))

    expect(screen.getByRole('link', { name: 'Opportunities' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Vacatures' })).not.toBeInTheDocument()
  })

  it('persists the chosen language to localStorage', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />, { language: 'nl' })

    await user.click(screen.getByRole('button', { name: 'EN' }))

    expect(localStorage.getItem('language')).toBe('en')
  })
})
