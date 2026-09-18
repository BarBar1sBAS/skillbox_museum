import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import {
  collectedKeys,
  KEY_LABEL,
  keyEarnedAt,
  parseSceneNumber,
  resultCopy,
  saveAnswer,
  scenes,
} from '@/app/scenes/index.ts'
import type { SceneContent, SceneKey, SceneOutcome } from '@/app/scenes/types.ts'
import { useTheme } from '@/app/theme.ts'
import {
  Button,
  ChatBubble,
  ChatHeader,
  ChoiceCard,
  KeyModal,
  Page,
  ScenePill,
  Stack,
  StatusMark,
  Text,
  ThemeToggle,
  VoiceBubble,
  type KeyStep,
  type SceneNumber,
  type StatusTone,
} from '@/uikit/index.ts'
import styles from './Scene.module.scss'

const STATUS: Record<SceneOutcome, { tone: StatusTone; color: string }> = {
  correct: { tone: 'lime', color: 'var(--color-lime)' },
  partial: { tone: 'orange', color: 'var(--color-orange)' },
  wrong: { tone: 'red', color: 'var(--color-red)' },
}

const PROMPT = 'Как ты поступишь?'

type Step = 'intro' | 'quiz' | 'result'

type EarnedKey = { key: SceneKey; step: KeyStep }

export function Scene() {
  const { n: raw } = useParams()
  const n = parseSceneNumber(raw)
  if (n == null) return <Navigate to="/rules" replace />
  return <ScenePlay key={n} n={n} />
}

function ScenePlay({ n }: { n: SceneNumber }) {
  const navigate = useNavigate()
  const [theme, setTheme] = useTheme()
  const scene = scenes[n]
  const [step, setStep] = useState<Step>(scene.intro ? 'intro' : 'quiz')
  const [picked, setPicked] = useState<0 | 1 | 2 | null>(null)
  const [earned, setEarned] = useState<EarnedKey | null>(null)
  const outcome = picked != null ? scene.choices[picked].outcome : null
  const result = step === 'result' && outcome ? resultCopy(scene, outcome) : null

  if (step === 'intro' && scene.intro) {
    return (
      <Page
        tone="chat"
        data-scene={n}
        className={[styles.photoPage, styles.introPage].join(' ')}
      >
        <img className={styles.bg} src={scene.intro.image} alt="" />
        <header className={styles.photoHeader}>
          <ThemeToggle theme={theme} onChange={setTheme} />
          <ScenePill n={n} />
        </header>
        <div className={styles.titleCard}>
          <Text as="h1" variant="h1" className={styles.introTitle}>
            {scene.intro.title}
          </Text>
        </div>
        <div className={styles.cta}>
          <Button onClick={() => setStep('quiz')}>{scene.intro.cta}</Button>
        </div>
      </Page>
    )
  }

  if (result && outcome) {
    const pad = String(n).padStart(2, '0')
    const status = STATUS[outcome]
    return (
      <Page tone="result" className={styles.resultPage}>
        <header className={styles.header}>
          <Text as="span" variant="h4" color="muted">
            РЕЗУЛЬТАТ
          </Text>
          <Text as="span" variant="h4" color="muted">
            СЦЕНА {pad}/10
          </Text>
        </header>
        <div className={styles.mark}>
          <StatusMark tone={status.tone} />
        </div>
        <Text
          variant="eyebrow"
          className={styles.resultEyebrow}
          style={{ color: status.color }}
        >
          {result.eyebrow}
        </Text>
        <Text as="h2" variant="h2" className={styles.resultTitle}>
          {result.title}
        </Text>
        <Text variant="bodyM" className={styles.resultBody}>
          {result.body}
        </Text>
        {result.remember ? <Remember text={result.remember} /> : null}
        {result.keyLine ? (
          <div className={styles.keyLine}>
            <span
              className={styles.dot}
              style={{ ['--tone' as string]: status.color }}
            />
            <Text as="span" variant="h4">
              {result.keyLine}
            </Text>
          </div>
        ) : null}
        <div className={styles.cta}>
          <Button onClick={() => navigate(n < 10 ? `/scene/${n + 1}` : '/final')}>
            {n < 10 ? 'ПРОДОЛЖИТЬ' : 'УЗНАТЬ РЕЗУЛЬТАТ'}
          </Button>
        </div>
        {earned ? (
          <div className={styles.keyOverlay}>
            <button
              type="button"
              className={styles.keyBackdrop}
              aria-label="Закрыть"
              onClick={() => setEarned(null)}
            />
            <div className={styles.keyModal}>
              <KeyModal keyName={KEY_LABEL[earned.key].chip} step={earned.step} />
            </div>
          </div>
        ) : null}
      </Page>
    )
  }

  return (
    <Quiz
      n={n}
      scene={scene}
      picked={picked}
      onPick={setPicked}
      onConfirm={() => {
        if (picked != null) {
          const chosen = scene.choices[picked].outcome
          const answers = saveAnswer(n, chosen)
          const key = keyEarnedAt(n, answers)
          setEarned(key ? { key, step: collectedKeys(answers).length as KeyStep } : null)
          setStep('result')
        }
      }}
    />
  )
}

function Quiz({
  n,
  scene,
  picked,
  onPick,
  onConfirm,
}: {
  n: SceneNumber
  scene: SceneContent
  picked: 0 | 1 | 2 | null
  onPick: (i: 0 | 1 | 2) => void
  onConfirm: () => void
}) {
  const navigate = useNavigate()
  const choices = (
    <>
      {scene.choices.map((choice, i) => (
        <ChoiceCard
          key={choice.text || i}
          selected={picked === i}
          onClick={() => onPick(i as 0 | 1 | 2)}
        >
          {choice.text}
        </ChoiceCard>
      ))}
    </>
  )

  const confirm = (
    <div className={[styles.cta, picked == null && styles.dim].filter(Boolean).join(' ')}>
      <Button size={scene.photo || scene.quiz === 'chat' ? 'l' : 'm'} onClick={onConfirm}>
        ПОДТВЕРДИТЬ ВЫБОР
      </Button>
    </div>
  )

  if (scene.quiz === 'chat' && scene.chat) {
    return (
      <Page tone="chat" className={styles.chatPage}>
        <ChatHeader
          name={scene.chat.name}
          status={scene.chat.status}
          onBack={() => navigate('/rules')}
        />
        <Text variant="bodyS" className={styles.today}>
          Сегодня
        </Text>
        <div className={styles.thread}>
          {scene.chat.messages.map((m) =>
            m.kind === 'voice' ? (
              <VoiceBubble key={m.text} duration={m.duration} time={m.time}>
                {m.text}
              </VoiceBubble>
            ) : (
              <ChatBubble key={m.text} time={m.time}>
                {m.text}
              </ChatBubble>
            ),
          )}
        </div>
        <div className={styles.chatQuiz}>
          <Text as="h1" variant="h1">
            {PROMPT}
          </Text>
          {choices}
        </div>
        {confirm}
      </Page>
    )
  }

  if (scene.photo) {
    return (
      <Page
        tone="chat"
        data-scene={n}
        className={[styles.photoPage, styles.photoQuizPage].join(' ')}
      >
        <div className={styles.photoFrame}>
          <img className={styles.bg} src={scene.photo} alt="" />
        </div>
        {scene.situation ? (
          <div className={styles.situationCard}>
            <Text variant="bodyL">{scene.situation}</Text>
          </div>
        ) : null}
        <div className={styles.sheet}>
          <Text as="h1" variant="h1">
            {PROMPT}
          </Text>
          {choices}
          {confirm}
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <header className={styles.header}>
        <Text as="span" variant="kicker">
          СИТУАЦИЯ
        </Text>
        <ScenePill n={n} />
      </header>
      <Stack gap={20}>
        {scene.situation ? <Text variant="bodyM">{scene.situation}</Text> : null}
        <Text as="h3" variant="bodyL">
          {PROMPT}
        </Text>
        {choices}
      </Stack>
      {confirm}
    </Page>
  )
}

function Remember({ text }: { text: string }) {
  const i = text.indexOf(':')
  const lead = i >= 0 ? text.slice(0, i + 1) : ''
  const rest = i >= 0 ? text.slice(i + 1) : text
  return (
    <div className={styles.remember}>
      <Text variant="bodyL">
        {lead ? (
          <Text as="span" variant="bodyL" style={{ color: 'var(--color-lime)' }}>
            {lead}
          </Text>
        ) : null}
        {rest}
      </Text>
    </div>
  )
}
