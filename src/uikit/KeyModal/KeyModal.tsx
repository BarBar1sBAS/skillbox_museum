import keyLime from '../icons/key-lime.svg'
import { Text } from '../Text/Text.tsx'
import styles from './KeyModal.module.scss'

export type KeyStep = 1 | 2 | 3

type KeyModalProps = {
  step?: KeyStep
  keyName?: string
}

export function KeyModal({ step = 1, keyName = 'ДАННЫЕ' }: KeyModalProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden>
        <img src={keyLime} alt="" width={28} height={14} />
      </span>
      <p className={styles.title}>
        КЛЮЧ “{keyName}”
        <span className={styles.got}>ПОЛУЧЕН</span>
      </p>
      <Text variant="bodyL" color="primary" className={styles.lead} style={{ opacity: 0.7 }}>
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
