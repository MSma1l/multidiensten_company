import { useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateContactForm,
} from '../../utils/validation.js'
import styles from './Contact.module.css'

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', message: '' }

// Optional CV upload constraints (mirrored on the backend, which is the source
// of truth). Extensions are matched case-insensitively; size cap is 5 MB.
const ALLOWED_CV_EXTENSIONS = ['pdf', 'doc', 'docx']
const MAX_CV_SIZE = 5 * 1024 * 1024

// Validates the optional CV file: returns an error KEY (matching
// translations.contact.errors) or '' when there is no file / it is valid.
function validateCv(file) {
  if (!file) return ''
  const ext = file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_CV_EXTENSIONS.includes(ext)) return 'cvType'
  if (file.size > MAX_CV_SIZE) return 'cvSize'
  return ''
}

// Backend base URL. Falls back to the local dev server when not provided.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// Whether a backend is explicitly configured. When it is not (e.g. unit tests
// or local dev without a backend), we keep the original optimistic behaviour.
const API_CONFIGURED = Boolean(import.meta.env.VITE_API_URL)

// Maps a field name + error key ('Required' | 'Invalid') to a translation key.
const ERROR_KEY = {
  firstName: { Required: 'firstNameRequired', Invalid: 'firstNameInvalid' },
  lastName: { Required: 'lastNameRequired', Invalid: 'lastNameInvalid' },
  email: { Required: 'emailRequired', Invalid: 'emailInvalid' },
  phone: { Required: 'phoneRequired', Invalid: 'phoneInvalid' },
  message: { Required: 'messageRequired', Invalid: 'messageInvalid' },
}

const FIELD_VALIDATOR = {
  firstName: validateName,
  lastName: validateName,
  email: validateEmail,
  phone: validatePhone,
  message: validateMessage,
}

export default function Contact() {
  const { t } = useLanguage()
  const c = t.contact

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [cv, setCv] = useState(null)
  const [cvError, setCvError] = useState('')
  const cvInputRef = useRef(null)

  // Resolves a field's error key into a localized message (or '' if valid).
  const messageFor = (field) => {
    const key = errors[field]
    return key ? c.errors[ERROR_KEY[field][key]] : ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Re-validate a field that already showed an error, for live feedback.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: FIELD_VALIDATOR[name](value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: FIELD_VALIDATOR[name](value) }))
  }

  const handleCvChange = (e) => {
    const file = e.target.files?.[0] ?? null
    setCv(file)
    setCvError(validateCv(file))
  }

  // Marks the submission as successful and clears the form.
  const succeed = () => {
    setSubmitted(true)
    setValues(EMPTY)
    setTouched({})
    setCv(null)
    setCvError('')
    if (cvInputRef.current) cvInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const validation = validateContactForm(values)
    setErrors(validation)
    setTouched({ firstName: true, lastName: true, email: true, phone: true, message: true })

    // Client-side validation of the text fields must pass first.
    if (Object.keys(validation).length !== 0) return

    // Then the optional CV file (extension + size) is validated client-side.
    const cvErr = validateCv(cv)
    setCvError(cvErr)
    if (cvErr) return

    // No backend configured (unit tests / local dev without an API): keep the
    // original optimistic behaviour so the success UI shows immediately.
    if (!API_CONFIGURED) {
      succeed()
      return
    }

    setSubmitting(true)
    try {
      // Multipart body: 5 text fields + the optional CV. We deliberately do not
      // set Content-Type so the browser adds the multipart boundary itself.
      const formData = new FormData()
      formData.append('firstName', values.firstName)
      formData.append('lastName', values.lastName)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('message', values.message)
      if (cv) formData.append('cv', cv)

      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        body: formData,
      })

      // The backend is the source of truth for validation. On a non-2xx
      // response we surface its `detail` message and keep the form intact so
      // the UI reflects that nothing was saved.
      if (!res.ok) {
        let detail = ''
        try {
          const data = await res.json()
          if (typeof data?.detail === 'string') detail = data.detail
        } catch {
          detail = ''
        }
        setServerError(detail || c.serverError)
        return
      }

      succeed()
    } catch {
      // Network failure: show a generic error, leave the form untouched.
      setServerError(c.serverError)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = (field) =>
    `${styles.input}${messageFor(field) ? ` ${styles.inputError}` : ''}`

  return (
    <div className={`page ${styles.contactPage}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.subtitle}>{c.subtitle}</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.group}>
              <label htmlFor="firstName">{c.firstName}</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={fieldClass('firstName')}
                placeholder={c.firstNamePlaceholder}
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(messageFor('firstName'))}
              />
              {messageFor('firstName') && (
                <span className={styles.errorText}>{messageFor('firstName')}</span>
              )}
            </div>

            <div className={styles.group}>
              <label htmlFor="lastName">{c.lastName}</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={fieldClass('lastName')}
                placeholder={c.lastNamePlaceholder}
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(messageFor('lastName'))}
              />
              {messageFor('lastName') && (
                <span className={styles.errorText}>{messageFor('lastName')}</span>
              )}
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="email">{c.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              className={fieldClass('email')}
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(messageFor('email'))}
            />
            {messageFor('email') && (
              <span className={styles.errorText}>{messageFor('email')}</span>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="phone">{c.phone}</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={fieldClass('phone')}
              placeholder="+31 6 12345678"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(messageFor('phone'))}
            />
            {messageFor('phone') && (
              <span className={styles.errorText}>{messageFor('phone')}</span>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="message">{c.message}</label>
            <textarea
              id="message"
              name="message"
              className={`${styles.textarea}${messageFor('message') ? ` ${styles.inputError}` : ''}`}
              placeholder={c.messagePlaceholder}
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(messageFor('message'))}
            />
            {messageFor('message') && (
              <span className={styles.errorText}>{messageFor('message')}</span>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor="cv">{c.cv}</label>
            <input
              id="cv"
              name="cv"
              type="file"
              ref={cvInputRef}
              accept=".pdf,.doc,.docx"
              className={`${styles.input}${cvError ? ` ${styles.inputError}` : ''}`}
              onChange={handleCvChange}
              aria-invalid={Boolean(cvError)}
            />
            {cvError && <span className={styles.errorText}>{c.errors[cvError]}</span>}
          </div>

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? c.submitting : c.submit}
          </button>

          {serverError && (
            <div className={styles.serverError} role="alert">
              {serverError}
            </div>
          )}

          {submitted && <div className={styles.success}>{c.success}</div>}
        </form>
      </div>
    </div>
  )
}
