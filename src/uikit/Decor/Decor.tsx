import styles from './Decor.module.scss'

export function Decor() {
  return (
    <div className={styles.decor} aria-hidden>
      <span className={styles.rings} />
    </div>
  )
}
