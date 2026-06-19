import { useState } from 'react'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateContactForm(values)
    setErrors(validation)
    setTouched({ firstName: true, lastName: true, email: true, phone: true, message: true })

    if (Object.keys(validation).length === 0) {
      // UI only: no network request. Show success and reset the form.
      setSubmitted(true)
      setValues(EMPTY)
      setTouched({})
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

          <button type="submit" className={styles.submit}>
            {c.submit}
          </button>

          {submitted && <div className={styles.success}>{c.success}</div>}
        </form>
      </div>
    </div>
  )
}
