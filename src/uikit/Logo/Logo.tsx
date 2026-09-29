import styles from './Logo.module.scss'

const MUSEUM_URL = 'https://cryptography-museum.ru/'

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
