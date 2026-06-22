import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import Jobs from './Jobs.jsx'

// The Jobs page now fetches its listings from `GET /api/jobs`, so we stub
// `fetch` with a small sample in the API shape and assert against that.
const SAMPLE_JOBS = [
  { id: 1, title: 'Verpleegkundige', titleEN: 'Registered Nurse', company: 'Randstad', location: 'Rotterdam', salary: '€2.400 - €3.000', salaryRange: '2000-3000', level: 'middle', experienceYears: 4, hoursPerWeek: 36, desc: 'Patiëntenzorg en ondersteuning', descEN: 'Patient care and support' },
  { id: 2, title: 'CNC-operator', titleEN: 'CNC Operator', company: 'Randstad', location: 'Eindhoven', salary: '€2.200 - €2.800', salaryRange: '2000-3000', level: 'middle', experienceYears: 3, hoursPerWeek: 38, desc: 'Bediening van precisie CNC-machines', descEN: 'Operating precision CNC machines' },
  { id: 3, title: 'Financieel Analist', titleEN: 'Financial Analyst', company: 'Randstad', location: 'Amsterdam', salary: '€3.000 - €4.000', salaryRange: '3000-4000', level: 'middle', experienceYears: 3, hoursPerWeek: 36, desc: 'Financiële analyse en rapportage', descEN: 'Financial analysis and reporting' },
]

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => SAMPLE_JOBS,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

function setup() {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(<Jobs />, { language: 'en' }),
  }
}

// Filters live in a collapsed dropdown; open it before touching the inputs.
async function openFilters(user) {
  await user.click(screen.getByRole('button', { name: /filters/i }))
}

describe('Jobs page', () => {
  it('fetches and renders every job by default', async () => {
    setup()

    // Wait for the async fetch to resolve and the cards to appear.
    const links = await screen.findAllByRole('link', { name: 'Apply Now' })
    expect(links).toHaveLength(SAMPLE_JOBS.length)
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/jobs'))
  })

  it('filters by search term', async () => {
    const { user } = setup()
    await screen.findByText('Registered Nurse')
    await openFilters(user)

    await user.type(screen.getByLabelText('Search'), 'nurse')

    expect(screen.getByText('Registered Nurse')).toBeInTheDocument()
    expect(screen.queryByText('CNC Operator')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Apply Now' })).toHaveLength(1)
  })

  it('filters by location', async () => {
    const { user } = setup()
    await screen.findByText('Registered Nurse')
    await openFilters(user)

    await user.selectOptions(screen.getByLabelText('Location'), 'Eindhoven')

    expect(screen.getByText('CNC Operator')).toBeInTheDocument()
    expect(screen.queryByText('Registered Nurse')).not.toBeInTheDocument()
  })

  it('combines filters and shows a message when nothing matches', async () => {
    const { user } = setup()
    await screen.findByText('Registered Nurse')
    await openFilters(user)

    // "nurse" is in Rotterdam, so filtering to Amsterdam yields no results.
    await user.type(screen.getByLabelText('Search'), 'nurse')
    await user.selectOptions(screen.getByLabelText('Location'), 'Amsterdam')

    expect(screen.getByText('No openings match these filters.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Apply Now' })).not.toBeInTheDocument()
  })

  it('shows an empty-state message when the backend returns no jobs', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    setup()

    expect(
      await screen.findByText('There are currently no openings available.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Apply Now' })).not.toBeInTheDocument()
  })

  it('shows an error message when the fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'))
    setup()

    expect(
      await screen.findByText('Could not load jobs. Please try again later.'),
    ).toBeInTheDocument()
  })
})
