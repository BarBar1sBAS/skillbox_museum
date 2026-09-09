import type { ReactNode } from 'react'
import { Text } from '../Text/Text.tsx'
import styles from './ChatBubble.module.scss'

type ChatBubbleProps = {
  time: string
  children: ReactNode
}

export function ChatBubble({ time, children }: ChatBubbleProps) {
  return (
    <div className={styles.bubble}>
      <Text variant="bodyM">{children}</Text>
      <Text as="span" variant="bodyS" className={styles.time}>
        {time}
      </Text>
    </div>
  )
}
