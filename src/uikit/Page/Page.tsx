import type { ReactNode } from 'react'
import styles from './Page.module.scss'

export type PageTone = 'landing' | 'default' | 'chat' | 'result'

type PageProps = {
  tone?: PageTone
  className?: string
  children?: ReactNode
  'data-scene'?: number
}

export function Page({
  tone = 'default',
  className,
  children,
  'data-scene': dataScene,
}: PageProps) {
  return (
    <main
      className={[styles.page, styles[tone], className].filter(Boolean).join(' ')}
      data-scene={dataScene}
    >
      {children}
    </main>
  )
}
