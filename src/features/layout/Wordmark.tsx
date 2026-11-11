import styles from './Wordmark.module.css'

export const Wordmark = ({ className }: { className?: string }) => (
  <span className={`${styles.wordmark} ${className ?? ''}`}>
    <span className={styles.top}>HOCKEY</span>
    <span className={styles.bottom}>MANAGEMENT</span>
  </span>
)
