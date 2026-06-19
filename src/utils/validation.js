// Pure, UI-side validation helpers for the contact form.
// Each validator returns an error KEY (matching translations.contact.errors)
// or an empty string when the value is valid. The component maps the key to a
// localized message, so messages stay translatable.

// Letters incl. accented chars, spaces, hyphens and apostrophes. No digits.
const NAME_REGEX = /^[\p{L}][\p{L}\s'-]{1,}$/u

// Pragmatic email check: something@something.tld
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(value) {
  const v = value.trim()
  if (!v) return 'Required'
  if (!NAME_REGEX.test(v)) return 'Invalid'
  return ''
}

export function validateEmail(value) {
  const v = value.trim()
  if (!v) return 'Required'
  if (!EMAIL_REGEX.test(v)) return 'Invalid'
  return ''
}

export function validatePhone(value) {
  const v = value.trim()
  if (!v) return 'Required'
  // Allow digits, spaces, +, -, parentheses; require 7–15 actual digits
  // (loosely matching international / Dutch formats like +31 6 12345678).
  if (!/^[+]?[\d\s()-]+$/.test(v)) return 'Invalid'
  const digits = v.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) return 'Invalid'
  return ''
}

export function validateMessage(value) {
  const v = value.trim()
  if (!v) return 'Required'
  if (v.length < 10) return 'Invalid'
  return ''
}

// Runs every field validator and returns a map of fieldName -> errorKey,
// containing only the fields that currently have an error.
export function validateContactForm(values) {
  const validators = {
    firstName: validateName,
    lastName: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
  }

  const errors = {}
  for (const [field, validate] of Object.entries(validators)) {
    const result = validate(values[field] ?? '')
    if (result) errors[field] = result
  }
  return errors
}
