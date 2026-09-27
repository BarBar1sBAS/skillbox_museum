import { useNavigate } from 'react-router'
import { KEY_LABEL } from '@/app/scenes/index.ts'
import { useTheme } from '@/app/theme.ts'
import {
  Button,
  ChatCard,
  Decor,
  Logo,
  Page,
  ScenePill,
  Stack,
  Text,
  ThemeToggle,
  TrustChip,
} from '@/uikit/index.ts'
import styles from './Start.module.scss'

const STEPS = [
  'Пройди 10 ситуаций цифрового дня.',
  'Принимай решения, открывай ключи и расшифруй послание.',
]

export function Start() {
  const navigate = useNavigate()
  const [theme, setTheme] = useTheme()

  return (
    <Page className={styles.page}>
      <Decor />
      <Stack gap={25}>
        <header className={styles.header}>
          <Logo />
          <ThemeToggle theme={theme} onChange={setTheme} />
          <ScenePill label="10 сцен" />
        </header>

        <Text as="h1" variant="h1" className={styles.title}>
          МУЗЕЙ ПРИСЛАЛ ТЕБЕ{' '}
          <Text as="span" variant="h1" color="accent">
            ЗАШИФРОВАННОЕ СООБЩЕНИЕ
          </Text>
        </Text>

        <ChatCard />

        <ul className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step}>
              <Text as="span" variant="bodyM">
                {step}
              </Text>
            </li>
          ))}
        </ul>

        <div className={styles.keys}>
          {Object.values(KEY_LABEL).map((key) => (
            <TrustChip key={key.chip} label={key.chip} />
          ))}
        </div>

        <Text variant="bodyM" color="muted" className={styles.discount}>
          Каждый ключ увеличивает скидку на выставку: 5%
          <span className={styles.inlineArrow} aria-hidden />
          7%
          <span className={styles.inlineArrow} aria-hidden />
          10%.
        </Text>
      </Stack>

      <div className={styles.cta}>
        <Button arrow onClick={() => navigate('/rules')}>
          КАК ИГРАТЬ
        </Button>
      </div>
    </Page>
  )
}
