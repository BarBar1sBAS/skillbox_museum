import type { ReactNode } from 'react'
import type { Spacing } from '../tokens.ts'
import styles from './Stack.module.scss'

type StackProps = {
  gap?: Spacing
  children?: ReactNode
}

export function Stack({ gap = 20, children }: StackProps) {
  return (
    <div
      className={styles.stack}
      style={{ gap: `calc(var(--spacing-${gap}) * 1px)` }}
    >
      {children}
    </div>
  )
}
