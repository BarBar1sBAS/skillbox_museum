import { EXHIBITION_URL } from '@/uikit/museum'
import { MuseumHeader } from '@/app/MuseumHeader'
import { TrustChip } from '@/uikit/TrustChip/TrustChip'
import { collectedKeys } from '@/app/scenes'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  KEY_LABEL,
  loadAnswers,
  keyScores,
  levelOf,
  safeDecisions,
  totalScore,
} from '@/app/scenes/index.ts'
import {
  Button,
  Modal,
  Page,
  ScoreRing,
  Stack,
  StatBar,
  Text,
} from '@/uikit/index.ts'
import bastion from '@/uikit/icons/bastion.svg'
import styles from './Result.module.scss'

const CHECKLIST_URL = `${import.meta.env.BASE_URL}files/chek-list_vystavka.pdf`
const CHECKLIST_NAME = 'Чек-лист посещения выставки.pdf'

export function Result() {
  const navigate = useNavigate()
  const [details, setDetails] = useState(false)
  const answers = loadAnswers()
  const keys = collectedKeys(answers)
  const index = totalScore(answers)
  const safe = safeDecisions(answers)
  const scores = keyScores(answers)
  const level = levelOf(index)

  return (
    <Page className={styles.page}>
      <MuseumHeader />

      <Text as="h1" variant="h1" className={styles.title}>
        Твой результат
      </Text>

      <div className={styles.scoreCard}>
        <div className={styles.scoreRow}>
          <ScoreRing value={index} />
          <div className={styles.scoreCopy}>
            <Text variant="bodyM" className={styles.scoreLabel}>
              Твой индекс
              <br />
              цифровой безопасности
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

      <div className={styles.keys}>
        {Object.entries(KEY_LABEL).map(([key, label]) => (
          <TrustChip
            key={key}
            label={label.chip}
            active={keys.some((k) => k === key)}
          />
        ))}
      </div>
      <p className={styles.explanation}>
        Ключи открываются за каждые три верных ответа. Проценты в подробностях
        показывают результат по отдельным темам.
      </p>
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
            безопасность — без сложных терминов.
          </Text>
          <a
            className={styles.exhibitLink}
            href={EXHIBITION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="span" variant="eyebrow" color="accent">
              УЗНАТЬ О ВЫСТАВКЕ
            </Text>
            <span className={styles.exhibitArrow} aria-hidden />
          </a>
        </Stack>
      </div>

      <div className={styles.partner}>
        <Text variant="eyebrow" className={styles.partnerLabel}>
          экспертная поддержка
          <br />
          проекта
        </Text>
        <img
          className={styles.bastion}
          src={bastion}
          alt="Бастион"
          width={118}
          height={26}
        />
      </div>

      <a
        className={styles.checklist}
        href={CHECKLIST_URL}
        download={CHECKLIST_NAME}
      >
        <Text as="span" variant="eyebrow" className={styles.partnerLabel}>
          скачать чек-лист
          <br />
          посещения выставки
        </Text>
        <span className={styles.downloadIcon} aria-hidden />
      </a>

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
              <div className={styles.insight}>
                <Text
                  variant="eyebrow"
                  color="muted"
                  className={styles.insightLead}
                >
                  <span className={styles.dot} />
                  Твой уровень
                </Text>
                <Text as="h3" variant="h3Bold">
                  {level.title}
                </Text>
                <Text variant="bodyM" className={styles.insightBody}>
                  {level.body}
                </Text>
              </div>
            </Stack>
          </div>
        </Modal>
      ) : null}
    </Page>
  )
}
