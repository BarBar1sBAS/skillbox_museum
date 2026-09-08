import radioOn from '../icons/radio-on.svg'
import radio from '../icons/radio.svg'
import { Text } from '../Text/Text.tsx'
import styles from './ChoiceCard.module.scss'

type ChoiceCardProps = {
  selected?: boolean
  children: string
  onClick?: () => void
}

export function ChoiceCard({ selected = false, children, onClick }: ChoiceCardProps) {
  return (
    <label className={[styles.card, selected && styles.selected].filter(Boolean).join(' ')}>
      <input
        type="radio"
        className={styles.input}
        checked={selected}
        onChange={() => onClick?.()}
      />
      <img
        className={styles.radio}
        src={selected ? radioOn : radio}
        alt=""
        width={23}
        height={23}
      />
      <Text as="span" variant="bodyM" color="primary" className={styles.label}>
        {children}
      </Text>
    </label>
  )
}
