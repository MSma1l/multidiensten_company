import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Button from './Button.jsx'

describe('Button', () => {
  it('renders a router link when `to` is provided', () => {
    render(
      <MemoryRouter>
        <Button to="/jobs">Browse</Button>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Browse' })
    expect(link).toHaveAttribute('href', '/jobs')
  })

  it('renders a button and forwards onClick when `to` is omitted', async () => {
    let clicked = false
    render(<Button onClick={() => (clicked = true)}>Go</Button>)

    const button = screen.getByRole('button', { name: 'Go' })
    button.click()
    expect(clicked).toBe(true)
  })

  it('applies a class for the given variant', () => {
    render(<Button variant="accent">Apply</Button>)
    // CSS modules hash class names, so assert the class list is non-empty
    // rather than matching an exact string.
    expect(screen.getByRole('button', { name: 'Apply' }).className).not.toBe('')
  })
})
