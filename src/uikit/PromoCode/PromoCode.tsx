import { Text } from '../Text/Text.tsx'
import styles from './PromoCode.module.scss'

export type PromoPercent = 5 | 7 | 10

type PromoCodeProps = {
  percent: PromoPercent
  code: string
}

export function PromoCode({ percent, code }: PromoCodeProps) {
  return (
    <div className={styles.card}>
      <div className={styles.copy}>
        <p className={styles.label}>ОТКРЫТА СКИДКА {percent}%</p>
        <Text variant="h3" color="onAccent">
          Твой промокод
        </Text>
      </div>
      <button
        type="button"
        className={styles.code}
        aria-label={`Скопировать ${code}`}
        onClick={() => void navigator.clipboard.writeText(code)}
      >
        {/* заливка иконки повторяет фон плашки, поэтому цвет берётся переменной */}
        <svg
          className={styles.icon}
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          aria-hidden
        >
          <rect
            x="0.5"
            y="4.5"
            width="14"
            height="14"
            rx="2.5"
            fill="var(--promo-bg)"
            stroke="black"
          />
          <rect
            x="4.5"
            y="0.5"
            width="14"
            height="14"
            rx="2.5"
            fill="var(--promo-bg)"
            stroke="black"
          />
        </svg>
        {code}
      </button>
    </div>
  )
}
