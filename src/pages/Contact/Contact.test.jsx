import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import Contact from './Contact.jsx'

function setup() {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(<Contact />, { language: 'en' }),
  }
}

describe('Contact form', () => {
  it('shows required errors when submitting an empty form', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Send Request' }))

    expect(screen.getByText('Please enter your first name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your last name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your phone number.')).toBeInTheDocument()
    expect(screen.getByText('Please write a message.')).toBeInTheDocument()

    // No success message on an invalid submit.
    expect(
      screen.queryByText(/We will contact you very soon/i),
    ).not.toBeInTheDocument()
  })

  it('shows a format error for an invalid email', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('Email Address'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Send Request' }))

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  it('clears a field error live once it becomes valid', async () => {
    const { user } = setup()

    const firstName = screen.getByLabelText('First Name')
    // Trigger the error first (blur with empty value).
    await user.click(firstName)
    await user.tab()
    expect(screen.getByText('Please enter your first name.')).toBeInTheDocument()

    // Typing a valid value should remove the error without re-submitting.
    await user.type(firstName, 'Jan')
    expect(screen.queryByText('Please enter your first name.')).not.toBeInTheDocument()
  })

  it('submits a valid form, shows success and resets the fields', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('First Name'), 'Jan')
    await user.type(screen.getByLabelText('Last Name'), 'Jansen')
    await user.type(screen.getByLabelText('Email Address'), 'jan@randstad.nl')
    await user.type(screen.getByLabelText('Phone Number'), '+31 6 12345678')
    await user.type(
      screen.getByLabelText('Your Message'),
      'I would like to apply for this opportunity.',
    )

    await user.click(screen.getByRole('button', { name: 'Send Request' }))

    expect(
      screen.getByText('Perfect! We will contact you very soon with exciting opportunities.'),
    ).toBeInTheDocument()

    // Form is cleared after a successful submit.
    expect(screen.getByLabelText('First Name')).toHaveValue('')
    expect(screen.getByLabelText('Email Address')).toHaveValue('')
  })
})
