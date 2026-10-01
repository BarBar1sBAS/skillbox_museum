import { Text } from '../Text/Text.tsx'
import styles from './ChoiceCard.module.scss'

type ChoiceCardProps = {
  name?: string
  selected?: boolean
  children: string
  onClick?: () => void
}

export function ChoiceCard({
  selected = false,
  children,
  onClick,
  name,
}: ChoiceCardProps) {
  return (
    <label
      className={[styles.card, selected && styles.selected]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="radio"
        name={name}
        className={styles.input}
        checked={selected}
        onChange={() => onClick?.()}
      />
      <Text as="span" variant="bodyM" color="primary" className={styles.label}>
        {children}
      </Text>
    </label>
  )
}
