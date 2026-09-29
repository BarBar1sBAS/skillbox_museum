import { Text } from '../Text/Text.tsx'
import { decodeFrame, runBits, runShapes, useDecoded, useTick } from './cipherMotion.ts'
import styles from './ChatCard.module.scss'

export type ChatReveal = 0 | 1 | 2 | 3

const CIPHER_SHAPES = '◈ □ △ ◇  ◈ □ △ ◇  ◈ □ △ ◇  ◈ □'
const CIPHER_BITS = '0101^0110001”;1001”00@1!1001**10'

const LINES = [
  {
    step: 1,
    cipher: CIPHER_SHAPES,
    plain: 'Каждый день ты оставляешь цифровой след',
  },
  {
    step: 2,
    cipher: CIPHER_BITS,
    plain: 'Но технологий не нужно бояться - их нужно понимать.',
  },
  {
    step: 3,
    cipher: CIPHER_SHAPES,
    plain: 'Узнай больше на выставке Музея криптографии',
  },
] as const

type ChatCardProps = {
  reveal?: ChatReveal
}

export function ChatCard({ reveal = 0 }: ChatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.avatar} aria-hidden>
          М
        </span>
        <div className={styles.meta}>
          <Text variant="bodyMBold" color="primary">
            Музей криптографии
          </Text>
          <Text variant="bodyS" color="primary" style={{ opacity: 0.75 }}>
            Сегодня, 08:00
          </Text>
        </div>
      </div>
      <hr className={styles.rule} />
      <div className={styles.body}>
        {LINES.map((line) =>
          line.step <= reveal ? (
            <PlainLine key={line.plain} text={line.plain} />
          ) : (
            <CipherLine key={line.plain} cipher={line.cipher} />
          ),
        )}
      </div>
    </div>
  )
}

// фигуры сдвигаются неспешно, двоичный код бежит быстрее
function CipherLine({ cipher }: { cipher: string }) {
  const shapes = cipher === CIPHER_SHAPES
  const tick = useTick(shapes ? 450 : 140)

  return (
    <Text
      className={[styles.cipher, shapes && styles.shapes].filter(Boolean).join(' ')}
      variant="cipher"
      color="primary"
      aria-hidden
    >
      {shapes ? runShapes(cipher, tick) : runBits(cipher, tick)}
    </Text>
  )
}

// настоящий текст лежит в скрытом span для экранного диктора,
// а глазами видно, как он проявляется из шума
function PlainLine({ text }: { text: string }) {
  const shown = useDecoded(text.length)

  return (
    <p className={styles.plain}>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden>{decodeFrame(text, shown)}</span>
    </p>
  )
}
