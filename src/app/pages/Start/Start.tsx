import { sceneVisual } from '@/app/scenes/visuals'
import { MuseumHeader } from '@/app/MuseumHeader'
import { PixelScene } from '@/uikit/PixelScene/PixelScene'
import { useNavigate } from 'react-router'
import { KEY_LABEL } from '@/app/scenes/index.ts'
import { Button, ChatCard, Page, Text, TrustChip } from '@/uikit/index.ts'
import styles from './Start.module.scss'

const STEPS = [
  'Пройди 10 ситуаций цифрового дня.',
  'Принимай решения, открывай ключи и расшифруй послание.',
]

export function Start() {
  const navigate = useNavigate()

  return (
    <Page className={styles.page}>
      <MuseumHeader />
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>КЛЮЧ К ДОВЕРИЮ</p>
          <Text as="h1" variant="h1" className={styles.title}>
            МУЗЕЙ ПРИСЛАЛ ТЕБЕ{' '}
            <Text as="span" variant="h1" color="accent">
              ЗАШИФРОВАННОЕ СООБЩЕНИЕ
            </Text>
          </Text>

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
            Каждый ключ увеличивает скидку на выставку “Ключ к доверию”: 5%
            <span className={styles.inlineArrow} aria-hidden />
            7%
            <span className={styles.inlineArrow} aria-hidden />
            10%.
          </Text>

          <div className={styles.cta}>
            <Button arrow onClick={() => navigate('/rules')}>
              КАК ИГРАТЬ
            </Button>
          </div>
        </div>
        <div className={styles.art}>
          <PixelScene
            {...sceneVisual(1, 'intro')}
            alt="Утро цифрового дня: телефон и часы у кровати"
            priority
          />
          <ChatCard />
        </div>
      </div>
      <footer className={styles.footer}>
        10 ситуаций · 3 ключа · один цифровой день
      </footer>
    </Page>
  )
}
