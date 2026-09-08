import keyLime from '../icons/key-lime.svg'
import key from '../icons/key.svg'
import { Text } from '../Text/Text.tsx'
import styles from './TrustChip.module.scss'

type TrustChipProps = {
  active?: boolean
  onClick?: () => void
}

export function TrustChip({ active = false, onClick }: TrustChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, active && styles.active].filter(Boolean).join(' ')}
      aria-pressed={active}
      onClick={onClick}
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
        ДОВЕРИЕ
      </Text>
    </button>
  )
}
