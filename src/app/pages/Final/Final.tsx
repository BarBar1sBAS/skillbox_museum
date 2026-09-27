import { useNavigate } from 'react-router'
import { collectedKeys, KEY_LABEL, resetProgress } from '@/app/scenes/index.ts'
import { useTheme } from '@/app/theme.ts'
import {
  Button,
  ChatCard,
  Decor,
  Logo,
  Page,
  PromoCode,
  ScenePill,
  Stack,
  Text,
  ThemeToggle,
  TrustChip,
  type ChatReveal,
  type PromoPercent,
} from '@/uikit/index.ts'
import styles from './Final.module.scss'

type KeyCount = 0 | 1 | 2 | 3

type FinalCopy = {
  eyebrow: string
  title: string
  accent: string
  promo?: { percent: PromoPercent; code: string }
}

const FINAL: Record<KeyCount, FinalCopy> = {
  0: {
    eyebrow: 'КЛЮЧИ НЕ СОБРАНЫ',
    title: 'ПОСЛАНИЕ',
    accent: 'НЕ РАСШИФРОВАНО',
  },
  1: {
    eyebrow: 'ПОЛУЧЕН НОВЫЙ КЛЮЧ',
    title: 'ЧАСТЬ ПОСЛАНИЯ',
    accent: 'РАСШИФРОВАНА',
    promo: { percent: 5, code: 'CRYPTO5' },
  },
  2: {
    eyebrow: 'ПОЛУЧЕН ВТОРОЙ КЛЮЧ',
    title: 'ЧАСТЬ ПОСЛАНИЯ',
    accent: 'РАСШИФРОВАНА',
    promo: { percent: 7, code: 'CRYPTO7' },
  },
  3: {
    eyebrow: 'ВСЕ КЛЮЧИ СОБРАНЫ',
    title: 'ПОСЛАНИЕ',
    accent: 'РАСШИФРОВАНО',
    promo: { percent: 10, code: 'CRYPTO10' },
  },
}

export function Final() {
  const navigate = useNavigate()
  const [theme, setTheme] = useTheme()
  const keys = collectedKeys()
  const count = keys.length as KeyCount
  const final = FINAL[count]

  return (
    <Page className={styles.page}>
      <Decor />
      <header className={styles.header}>
        <Logo />
        <ThemeToggle theme={theme} onChange={setTheme} />
        <ScenePill label="10 сцен" />
      </header>

      <Text variant="h3Bold" color="accent" className={styles.eyebrow}>
        {final.eyebrow}
      </Text>
      <Text as="h1" variant="h1" className={styles.title}>
        {final.title}{' '}
        <Text as="span" variant="h1" color="accent">
          {final.accent}
        </Text>
      </Text>

      <ChatCard reveal={count as ChatReveal} />

      <div className={styles.keys}>
        {(Object.keys(KEY_LABEL) as (keyof typeof KEY_LABEL)[]).map((key) => (
          <TrustChip
            key={key}
            label={KEY_LABEL[key].chip}
            active={keys.includes(key)}
          />
        ))}
      </div>

      <div className={styles.cta}>
        <Stack gap={20}>
          {final.promo ? (
            <PromoCode percent={final.promo.percent} code={final.promo.code} />
          ) : null}
          <Button
            arrow
            onClick={() => {
              resetProgress()
              navigate('/start')
            }}
          >
            ПОВТОРИТЬ
          </Button>
        </Stack>
      </div>
    </Page>
  )
}
