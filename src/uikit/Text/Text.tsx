import type { HTMLAttributes, ReactNode } from 'react'
import type { TextColor, TextVariant } from '../tokens.ts'
import styles from './Text.module.scss'

type TextProps = {
  color?: TextColor
  variant?: TextVariant
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'color'>

const COLOR_VAR: Record<TextColor, string> = {
  primary: '--text-primary',
  muted: '--text-muted',
  onAccent: '--text-on-accent',
  accent: '--text-accent',
}

export function Text({
  color = 'primary',
  variant = 'bodyM',
  as: Tag = 'p',
  children,
  className,
  style,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={[styles.text, className].filter(Boolean).join(' ')}
      style={{
        color: `var(${COLOR_VAR[color]})`,
        fontFamily: `var(--font-${variant}-family)`,
        fontSize: `var(--font-${variant}-size)`,
        fontWeight: `var(--font-${variant}-weight)`,
        opacity: variant === 'cipher' || variant === 'fineprint' ? 0.7 : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
