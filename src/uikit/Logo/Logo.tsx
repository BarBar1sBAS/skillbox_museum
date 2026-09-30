import { MUSEUM_URL } from '../museum.ts'
import styles from './Logo.module.scss'

export function Logo() {
  return (
    <a
      className={styles.logo}
      href={MUSEUM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Музей криптографии"
    >
      <span className={styles.mark} aria-hidden />
    </a>
  )
}
