import { useNavigate } from 'react-router'
import { KEY_LABEL } from '@/app/scenes/index.ts'
import {
  Button,
  ChatCard,
  Logo,
  Page,
  PromoCode,
  ScenePill,
  Stack,
  Text,
  TrustChip,
  type PromoPercent,
} from '@/uikit/index.ts'
import styles from './Final.module.scss'

type KeyCount = 1 | 2 | 3

const FINAL: Record<
  KeyCount,
  { eyebrow: string; title: string; accent: string; percent: PromoPercent; code: string }
> = {
  1: {
    eyebrow: 'ПОЛУЧЕН НОВЫЙ КЛЮЧ',
    title: 'ЧАСТЬ ПОСЛАНИЯ',
    accent: 'РАСШИФРОВАНА',
    percent: 5,
    code: 'CRYPTO5',
  },
  2: {
    eyebrow: 'ПОЛУЧЕН ВТОРОЙ КЛЮЧ',
    title: 'ЧАСТЬ ПОСЛАНИЯ',
    accent: 'РАСШИФРОВАНА',
    percent: 7,
    code: 'CRYPTO7',
  },
  3: {
    eyebrow: 'ВСЕ КЛЮЧИ СОБРАНЫ',
    title: 'ПОСЛАНИЕ',
    accent: 'РАСШИФРОВАНО',
    percent: 10,
    code: 'CRYPTO10',
  },
}

const keys: KeyCount = 2

export function Final() {
  const navigate = useNavigate()
  const final = FINAL[keys]

  return (
    <Page className={styles.page}>
      <header className={styles.header}>
        <Logo />
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

      <ChatCard reveal={keys} />

      <div className={styles.keys}>
        {Object.values(KEY_LABEL).map((key, i) => (
          <TrustChip key={key.chip} label={key.chip} active={i < keys} />
        ))}
      </div>

      <div className={styles.cta}>
        <Stack gap={20}>
          <PromoCode percent={final.percent} code={final.code} />
          <Button arrow onClick={() => navigate('/start')}>
            ПОВТОРИТЬ
          </Button>
        </Stack>
      </div>
    </Page>
  )
}
