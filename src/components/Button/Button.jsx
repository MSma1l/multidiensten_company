import { Link } from 'react-router-dom'
import styles from './Button.module.css'

// Reusable button. Renders a <Link> when `to` is provided, otherwise a
// <button>. `variant` controls the look across the different sections.
//   variants: primary | secondary | accent | gradient | blockAccent | blockOutline
//   size:     md (default) | lg
export default function Button({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.btn, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
