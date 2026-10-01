import { Logo } from '../Logo/Logo'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { ScenePill, type SceneNumber } from '../ScenePill/ScenePill'
import type { Theme } from '../ThemeToggle/ThemeToggle'
import styles from './MuseumHeader.module.scss'
export function MuseumHeader({
  n,
  theme,
  onThemeChange,
}: {
  n?: SceneNumber
  theme: Theme
  onThemeChange: (theme: Theme) => void
}) {
  return (
    <header className={styles.header}>
      <Logo />
      <span className={styles.caption}>
        Игра к выставке
        <br />
        «Ключ к доверию»
      </span>
      <div className={styles.controls}>
        <ScenePill n={n} label={n ? undefined : '10 сцен'} />
        <ThemeToggle theme={theme} onChange={onThemeChange} />
      </div>
    </header>
  )
}
