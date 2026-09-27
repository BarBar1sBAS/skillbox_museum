import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  GROWTH,
  INSIGHT,
  KEY_LABEL,
  keyScores,
  safeDecisions,
  strongestKey,
  totalScore,
  weakestKey,
} from '@/app/scenes/index.ts'
import { useTheme } from '@/app/theme.ts'
import {
  Button,
  Logo,
  Modal,
  Page,
  ScoreRing,
  Stack,
  StatBar,
  Text,
  ThemeToggle,
} from '@/uikit/index.ts'
import bastion from '@/uikit/icons/bastion.svg'
import styles from './Result.module.scss'

const EXHIBITION_URL = '#'

export function Result() {
  const navigate = useNavigate()
  const [theme, setTheme] = useTheme()
  const [details, setDetails] = useState(false)
  const index = totalScore()
  const safe = safeDecisions()
  const scores = keyScores()
  const strong = strongestKey()
  const weak = weakestKey()

  return (
    <Page className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>

      <Text as="h1" variant="h1" className={styles.title}>
        Твой результат
      </Text>

      <div className={styles.scoreCard}>
        <div className={styles.scoreRow}>
          <ScoreRing value={index} />
          <div className={styles.scoreCopy}>
            <Text variant="bodyM" className={styles.scoreLabel}>
              Твой индекс<br />цифровой безопасности
            </Text>
            <div className={styles.metrics}>
              <Text as="span" variant="bodyMBold" color="accent">
                {safe} из 10
              </Text>
              <Text as="span" variant="bodyM" color="muted">
                безопасных решений
              </Text>
            </div>
          </div>
        </div>
        <hr className={styles.rule} />
        <div className={styles.scoreAction}>
          <Button size="s" variant="outline" onClick={() => setDetails(true)}>
            ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ
          </Button>
        </div>
      </div>

      <div className={styles.exhibit}>
        <Stack gap={20}>
          <Text variant="eyebrow" color="accent">
            Продолжи исследование в музее
          </Text>
          <Text as="h2" variant="h2">
            Выставка “Ключ к доверию”
          </Text>
          <Text variant="bodyM" className={styles.exhibitBody}>
            Проверь свои навыки в интерактивах и узнай, как устроена цифровая
            безопасность - без сложных терминов.
          </Text>
          <a className={styles.exhibitLink} href={EXHIBITION_URL}>
            <Text as="span" variant="eyebrow" color="accent">
              УЗНАТЬ О ВЫСТАВКЕ
            </Text>
            <span className={styles.exhibitArrow} aria-hidden />
          </a>
        </Stack>
      </div>

      <div className={styles.partner}>
        <Text variant="eyebrow" className={styles.partnerLabel}>
          экспертная поддержка<br />проекта
        </Text>
        <img
          className={styles.bastion}
          src={bastion}
          alt="Бастион"
          width={118}
          height={26}
        />
      </div>

      <div className={styles.cta}>
        <Button onClick={() => navigate('/final')}>ПЕРЕЙТИ К ШИФРУ</Button>
      </div>

      {details ? (
        <Modal closeButton onClose={() => setDetails(false)}>
          <div className={styles.details}>
            <Stack gap={20}>
              {scores.map(({ key, score }) => (
                <StatBar key={key} label={KEY_LABEL[key].line} value={score} />
              ))}
              {index > 0 ? (
                <div className={styles.insight}>
                  <Text variant="eyebrow" color="muted" className={styles.insightLead}>
                    <span className={styles.dot} />
                    Твоя сильная сторона
                  </Text>
                  <Text as="h3" variant="h3Bold">
                    {INSIGHT[strong].title}
                  </Text>
                  <Text variant="bodyM" className={styles.insightBody}>
                    {INSIGHT[strong].body} Зона роста - {GROWTH[weak]}.
                  </Text>
                </div>
              ) : null}
            </Stack>
          </div>
        </Modal>
      ) : null}
    </Page>
  )
}
