import type { ReactNode } from 'react'
import arrowRight from '../icons/arrow-right.svg'
import { Text } from '../Text/Text.tsx'
import styles from './Button.module.scss'

export type ButtonSize = 'm' | 'l'

type ButtonProps = {
  children: ReactNode
  size?: ButtonSize
  arrow?: boolean
  onClick?: () => void
}

export function Button({
  children,
  size = 'm',
  arrow = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, size === 'l' && styles.large]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <Text as="span" variant={size === 'l' ? 'cta' : 'h3'} color="onAccent">
        {children}
      </Text>
      {arrow && (
        <img
          className={styles.arrow}
          src={arrowRight}
          alt=""
          width={25}
          height={14}
        />
      )}
    </button>
  )
}
