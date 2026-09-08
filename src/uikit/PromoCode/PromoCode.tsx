import copy from '../icons/copy.svg'
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
        <img
          className={styles.icon}
          src={copy}
          alt=""
          width={19}
          height={19}
          aria-hidden
        />
        {code}
      </button>
    </div>
  )
}
