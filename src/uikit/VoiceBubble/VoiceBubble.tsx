import type { ReactNode } from 'react'
import play from '../icons/play.svg'
import transcribe from '../icons/transcribe.svg'
import { Text } from '../Text/Text.tsx'
import styles from './VoiceBubble.module.scss'

const WAVE = [14, 18, 22, 16, 27, 21, 13, 20, 19, 12, 17, 23, 15, 11, 25, 10, 9, 24, 26, 8, 7, 6, 5, 4]

type VoiceBubbleProps = {
  duration: string
  time: string
  children: ReactNode
}

export function VoiceBubble({ duration, time, children }: VoiceBubbleProps) {
  return (
    <div className={styles.bubble}>
      <div className={styles.row}>
        <img className={styles.play} src={play} alt="" width={48} height={48} />
        <div className={styles.track}>
          <div className={styles.wave} aria-hidden>
            {WAVE.map((h) => (
              <span key={h} className={styles.bar} style={{ height: `${h / 16}rem` }} />
            ))}
          </div>
          <Text as="span" variant="bodyS" className={styles.duration}>
            {duration}
          </Text>
        </div>
        <button type="button" className={styles.transcribe} aria-label="Расшифровка">
          <img src={transcribe} alt="" width={11} height={8} />
          <Text as="span" variant="bodyM" style={{ color: 'var(--color-violet)' }}>
            A
          </Text>
        </button>
      </div>
      <Text variant="bodyM">{children}</Text>
      <Text as="span" variant="bodyS" className={styles.time}>
        {time}
      </Text>
    </div>
  )
}
