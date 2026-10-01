import { MUSEUM_URL } from '../museum.ts'
import { Text } from '../Text/Text.tsx'
import {
  decodeFrame,
  runBits,
  runShapes,
  useDecoded,
  useTick,
} from './cipherMotion.ts'
import styles from './ChatCard.module.scss'

export type ChatReveal = 0 | 1 | 2 | 3

const CIPHER_SHAPES = '01 ▧ 10 ▧  ДО ▧ Е ▧ ИЕ'
const CIPHER_BITS = '▧ А ▧ НЫЕ  01 ▧ 10'

const LINES = [
  {
    step: 1,
    cipher: CIPHER_SHAPES,
    plain: 'Каждый день ты оставляешь цифровой след.',
  },
  {
    step: 2,
    cipher: CIPHER_BITS,
    plain: 'Но технологий не нужно бояться — их нужно понимать.',
  },
  {
    step: 3,
    cipher: CIPHER_SHAPES,
    plain: 'Узнай больше на выставке Музея криптографии.',
    link: 'Музея криптографии',
  },
] as const

type ChatCardProps = {
  reveal?: ChatReveal
  animateStep?: 1 | 2 | 3
}

export function ChatCard({ reveal = 0, animateStep }: ChatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        СООБЩЕНИЕ МУЗЕЯ / {reveal === 3 ? 'РАСШИФРОВАНО' : 'ЗАШИФРОВАНО'}
      </div>
      <span className={styles.srOnly}>Открыто фрагментов: {reveal} из 3</span>
      <div className={styles.body}>
        {LINES.map((line) =>
          line.step <= reveal ? (
            <PlainLine
              key={line.plain}
              text={line.plain}
              animate={line.step === animateStep}
              link={'link' in line ? line.link : undefined}
            />
          ) : (
            <CipherLine key={line.plain} cipher={line.cipher} />
          ),
        )}
      </div>
    </div>
  )
}

function CipherLine({ cipher }: { cipher: string }) {
  const shapes = cipher === CIPHER_SHAPES
  const tick = useTick(shapes ? 450 : 140)

  return (
    <Text
      className={[styles.cipher, shapes && styles.shapes]
        .filter(Boolean)
        .join(' ')}
      variant="cipher"
      color="primary"
      aria-hidden
    >
      {shapes ? runShapes(cipher, tick) : runBits(cipher, tick)}
    </Text>
  )
}

function PlainLine({
  text,
  link,
  animate,
}: {
  text: string
  link?: string
  animate: boolean
}) {
  const shown = useDecoded(text.length, animate)
  const frame = decodeFrame(text, shown)

  if (shown >= text.length) {
    if (!link) return <p className={styles.plain}>{text}</p>
    const from = text.indexOf(link)
    return (
      <p className={styles.plain}>
        {text.slice(0, from)}
        <a
          className={styles.link}
          href={MUSEUM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </a>
        {text.slice(from + link.length)}
      </p>
    )
  }
  if (!link) {
    return (
      <p className={styles.plain}>
        <span className={styles.srOnly}>{text}</span>
        <span aria-hidden>{frame}</span>
      </p>
    )
  }

  // кадр расшифровки режется на те же куски, что и текст,
  // поэтому ссылка проявляется вместе с остальной строкой
  const from = text.indexOf(link)
  const to = from + link.length
  const part = (start: number, end?: number) => (
    <>
      <span className={styles.srOnly}>{text.slice(start, end)}</span>
      <span aria-hidden>{frame.slice(start, end)}</span>
    </>
  )

  return (
    <p className={styles.plain}>
      {part(0, from)}
      <a
        className={styles.link}
        href={MUSEUM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part(from, to)}
      </a>
      {part(to)}
    </p>
  )
}
