import radioLight from '../icons/radio-light.svg'
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
      {selected ? (
        <span className={[styles.radio, styles.radioOn].join(' ')} aria-hidden />
      ) : (
        <>
          <img
            className={[styles.radio, styles.radioDark].join(' ')}
            src={radio}
            alt=""
            width={23}
            height={23}
          />
          <img
            className={[styles.radio, styles.radioLight].join(' ')}
            src={radioLight}
            alt=""
            width={23}
            height={23}
          />
        </>
      )}
      <Text as="span" variant="bodyM" color="primary" className={styles.label}>
        {children}
      </Text>
    </label>
  )
}
