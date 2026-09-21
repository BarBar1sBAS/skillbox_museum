import { Text } from '../Text/Text.tsx'
import styles from './StatBar.module.scss'

type StatBarProps = {
  label: string
  value: number
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function StatBar({ label, value }: StatBarProps) {
  const score = clamp(value)
  return (
    <div
      className={styles.bar}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <div className={styles.meta}>
        <Text as="span" variant="subtitle">
          {label}
        </Text>
        <Text as="span" variant="subtitle">
          {score}/100
        </Text>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
