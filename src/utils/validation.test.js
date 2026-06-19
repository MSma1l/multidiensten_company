import { describe, it, expect } from 'vitest'
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateContactForm,
} from './validation.js'

describe('validateName', () => {
  it('flags empty / whitespace-only input as required', () => {
    expect(validateName('')).toBe('Required')
    expect(validateName('   ')).toBe('Required')
  })

  it('rejects names that are too short', () => {
    expect(validateName('A')).toBe('Invalid')
  })

  it('rejects names containing digits or symbols', () => {
    expect(validateName('John3')).toBe('Invalid')
    expect(validateName('John_Doe')).toBe('Invalid')
    expect(validateName('123')).toBe('Invalid')
  })

  it('accepts plain, accented, hyphenated and apostrophe names', () => {
    expect(validateName('Jan')).toBe('')
    expect(validateName('Anna-Maria')).toBe('')
    expect(validateName("O'Brien")).toBe('')
    expect(validateName('José')).toBe('')
    expect(validateName('Van der Berg')).toBe('')
  })

  it('trims surrounding whitespace before validating', () => {
    expect(validateName('  Jan  ')).toBe('')
  })
})

describe('validateEmail', () => {
  it('flags empty input as required', () => {
    expect(validateEmail('')).toBe('Required')
  })

  it('rejects malformed addresses', () => {
    for (const bad of ['john', 'john@', '@email.com', 'john@email', 'a@b.c', 'john doe@email.com']) {
      expect(validateEmail(bad), bad).toBe('Invalid')
    }
  })

  it('accepts well-formed addresses', () => {
    for (const ok of ['john@email.com', 'jan.jansen@randstad.nl', 'a@b.co']) {
      expect(validateEmail(ok), ok).toBe('')
    }
  })
})

describe('validatePhone', () => {
  it('flags empty input as required', () => {
    expect(validatePhone('')).toBe('Required')
  })

  it('rejects letters and too-short / too-long numbers', () => {
    expect(validatePhone('abc')).toBe('Invalid')
    expect(validatePhone('123')).toBe('Invalid') // < 7 digits
    expect(validatePhone('1234567890123456')).toBe('Invalid') // > 15 digits
  })

  it('accepts international and formatted Dutch numbers', () => {
    expect(validatePhone('+31 6 12345678')).toBe('')
    expect(validatePhone('0612345678')).toBe('')
    expect(validatePhone('+31 (0)30 202 0202')).toBe('')
  })
})

describe('validateMessage', () => {
  it('flags empty input as required', () => {
    expect(validateMessage('')).toBe('Required')
  })

  it('rejects messages shorter than 10 characters', () => {
    expect(validateMessage('too short')).toBe('Invalid')
  })

  it('accepts messages of at least 10 characters', () => {
    expect(validateMessage('Hello, I am interested in a role.')).toBe('')
  })
})

describe('validateContactForm', () => {
  const validValues = {
    firstName: 'Jan',
    lastName: 'Jansen',
    email: 'jan@randstad.nl',
    phone: '+31 6 12345678',
    message: 'I would like to apply for this position.',
  }

  it('returns no errors for a fully valid form', () => {
    expect(validateContactForm(validValues)).toEqual({})
  })

  it('collects an error key for each invalid field', () => {
    const errors = validateContactForm({
      firstName: '',
      lastName: 'X',
      email: 'nope',
      phone: 'abc',
      message: 'short',
    })
    expect(errors).toEqual({
      firstName: 'Required',
      lastName: 'Invalid',
      email: 'Invalid',
      phone: 'Invalid',
      message: 'Invalid',
    })
  })

  it('only reports the fields that are actually invalid', () => {
    const errors = validateContactForm({ ...validValues, email: 'bad' })
    expect(errors).toEqual({ email: 'Invalid' })
  })

  it('treats missing fields as required', () => {
    expect(validateContactForm({})).toEqual({
      firstName: 'Required',
      lastName: 'Required',
      email: 'Required',
      phone: 'Required',
      message: 'Required',
    })
  })
})
