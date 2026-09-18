import moon from '../icons/moon.svg'
import sun from '../icons/sun.svg'
import styles from './ThemeToggle.module.scss'

export type Theme = 'dark' | 'light'

type ThemeToggleProps = {
  theme?: Theme
  onChange?: (theme: Theme) => void
}

export function ThemeToggle({ theme = 'dark', onChange }: ThemeToggleProps) {
  const light = theme === 'light'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Светлая тема"
      className={[styles.toggle, light && styles.light].filter(Boolean).join(' ')}
      onClick={() => onChange?.(light ? 'dark' : 'light')}
    >
      <span className={styles.knob} />
      <img className={styles.moon} src={moon} alt="" width={12} height={13} />
      <img className={styles.sun} src={sun} alt="" width={13} height={14} />
    </button>
  )
}
