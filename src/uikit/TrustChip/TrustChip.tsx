import keyLime from '../icons/key-lime.svg'
import key from '../icons/key.svg'
import { Text } from '../Text/Text.tsx'
import styles from './TrustChip.module.scss'

type TrustChipProps = {
  label?: string
  active?: boolean
}

export function TrustChip({
  label = 'ДОВЕРИЕ',
  active = false,
}: TrustChipProps) {
  return (
    <div
      className={[styles.chip, active && styles.active].filter(Boolean).join(' ')}
    >
      <span className={styles.icon}>
        <img src={active ? keyLime : key} alt="" width={30} height={16} />
      </span>
      <Text
        as="span"
        variant="bodyS"
        color={active ? 'primary' : 'muted'}
        style={active ? { color: 'var(--color-lime)' } : undefined}
      >
        {label}
      </Text>
    </div>
  )
}
