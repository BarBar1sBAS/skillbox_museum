import { Text } from '../Text/Text.tsx'
import styles from './ScoreRing.module.scss'

type ScoreRingProps = {
  value: number
}

const SIZE = 96
const STROKE = 3
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function ScoreRing({ value }: ScoreRingProps) {
  const score = clamp(value)
  return (
    <div
      className={styles.ring}
      role="progressbar"
      aria-label="Индекс безопасности"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <svg className={styles.svg} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        <circle
          className={styles.disc}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - STROKE}
        />
        <circle
          className={styles.track}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className={styles.fill}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - score / 100)}
        />
      </svg>
      <div className={styles.value}>
        <Text as="span" variant="h1" className={styles.score}>
          {score}
        </Text>
        <Text as="span" variant="bodyS" color="muted">
          из 100
        </Text>
      </div>
    </div>
  )
}
