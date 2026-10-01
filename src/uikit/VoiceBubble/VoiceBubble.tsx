import type { ReactNode } from 'react'
import { Text } from '../Text/Text'
import styles from './VoiceBubble.module.scss'
export function VoiceBubble({
  duration,
  time,
  children,
}: {
  duration: string
  time: string
  children: ReactNode
}) {
  return (
    <div className={styles.bubble}>
      <Text variant="bodyS">Текст голосового сообщения</Text>
      <Text variant="bodyM">{children}</Text>
      <Text variant="bodyS">{duration}</Text>
      <Text as="span" variant="bodyS">
        {time}
      </Text>
    </div>
  )
}
