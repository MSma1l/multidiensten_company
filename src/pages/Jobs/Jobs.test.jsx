import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import Jobs from './Jobs.jsx'
import { jobs } from '../../data/jobs.js'

function setup() {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(<Jobs />, { language: 'en' }),
  }
}

describe('Jobs page', () => {
  it('renders every job by default', () => {
    setup()
    expect(screen.getAllByRole('link', { name: 'Apply Now' })).toHaveLength(jobs.length)
  })

  it('filters by search term', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('Search'), 'nurse')

    expect(screen.getByText('Registered Nurse')).toBeInTheDocument()
    expect(screen.queryByText('CNC Operator')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Apply Now' })).toHaveLength(1)
  })

  it('filters by location', async () => {
    const { user } = setup()

    await user.selectOptions(screen.getByLabelText('Location'), 'Eindhoven')

    expect(screen.getByText('CNC Operator')).toBeInTheDocument()
    expect(screen.queryByText('Registered Nurse')).not.toBeInTheDocument()
  })

  it('combines filters and shows a message when nothing matches', async () => {
    const { user } = setup()

    // "nurse" is in Rotterdam, so filtering to Amsterdam yields no results.
    await user.type(screen.getByLabelText('Search'), 'nurse')
    await user.selectOptions(screen.getByLabelText('Location'), 'Amsterdam')

    expect(screen.getByText('No openings match these filters.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Apply Now' })).not.toBeInTheDocument()
  })
})
