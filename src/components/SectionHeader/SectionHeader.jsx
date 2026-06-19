import styles from './SectionHeader.module.css'

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
