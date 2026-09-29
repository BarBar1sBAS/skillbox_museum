import { Text } from '../Text/Text.tsx'
import styles from './KeyModal.module.scss'

export type KeyStep = 1 | 2 | 3

type KeyModalProps = {
  step?: KeyStep
  keyName?: string
  onClose?: () => void
}

export function KeyModal({ step = 1, keyName = 'ДАННЫЕ', onClose }: KeyModalProps) {
  return (
    <div className={styles.card}>
      {onClose ? (
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
          <svg viewBox="0 0 18 18" aria-hidden>
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      ) : null}
      <span className={styles.icon} aria-hidden>
        {/* ключ из icons/key.svg, но встроенный: так он красится цветом акцента темы */}
        <svg viewBox="0 0 30 16" fill="none">
          <path
            d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM15 8H27.12C29.2954 8 28.9847 10.5455 28.9847 10.5455M23.9091 8.63636V11.8182"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <p className={styles.title}>
        КЛЮЧ “{keyName}”
        <span className={styles.got}>ПОЛУЧЕН</span>
      </p>
      <Text variant="bodyM" color="primary" className={styles.lead} style={{ opacity: 0.7 }}>
        Ты собрал ключ, теперь часть сообщения расшифрована.
      </Text>
      <div className={styles.step}>
        <Text as="span" variant="bodyL" color="primary">
          {step}/3
        </Text>
      </div>
    </div>
  )
}
