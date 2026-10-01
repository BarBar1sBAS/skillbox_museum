import type { ReactNode } from 'react'
import arrowRight from '../icons/arrow-right.svg'
import type { TextVariant } from '../tokens.ts'
import { Text } from '../Text/Text.tsx'
import styles from './Button.module.scss'

export type ButtonSize = 's' | 'm' | 'l'
export type ButtonVariant = 'solid' | 'outline'

type ButtonProps = {
  children: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  arrow?: boolean
  disabled?: boolean
  onClick?: () => void
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  s: styles.small,
  m: '',
  l: styles.large,
}

const LABEL: Record<ButtonSize, TextVariant> = {
  s: 'eyebrow',
  m: 'h3',
  l: 'cta',
}

export function Button({
  children,
  size = 'm',
  variant = 'solid',
  arrow = false,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        styles.button,
        SIZE_CLASS[size],
        variant === 'outline' && styles.outline,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      <Text
        as="span"
        variant={LABEL[size]}
        color={variant === 'outline' ? 'accent' : 'onAccent'}
      >
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
