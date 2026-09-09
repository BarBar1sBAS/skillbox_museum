import type { ReactNode } from 'react'
import styles from './Page.module.scss'

export type PageTone = 'landing' | 'default' | 'chat' | 'result'

type PageProps = {
  tone?: PageTone
  className?: string
  children?: ReactNode
}

export function Page({ tone = 'default', className, children }: PageProps) {
  return (
    <main
      className={[styles.page, styles[tone], className].filter(Boolean).join(' ')}
    >
      {children}
    </main>
  )
}
