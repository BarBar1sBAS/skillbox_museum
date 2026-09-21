import { useEffect, useState } from 'react'
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
  Modal,
  Page,
  ScenePill,
  StatusMark,
  Text,
  ThemeToggle,
  VoiceBubble,
  type KeyStep,
  type SceneNumber,
  type StatusTone,
  type Theme,
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
        <SceneImage className={styles.bg} src={scene.intro.image} theme={theme} />
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
        <Remember text={result.remember} />
        <div className={styles.keyLine}>
          <span
            className={styles.dot}
            style={{ ['--tone' as string]: status.color }}
          />
          <Text as="span" variant="h4">
            {result.keyLine}
          </Text>
        </div>
        <div className={styles.cta}>
          <Button onClick={() => navigate(n < 10 ? `/scene/${n + 1}` : '/result')}>
            {n < 10 ? 'ПРОДОЛЖИТЬ' : 'УЗНАТЬ РЕЗУЛЬТАТ'}
          </Button>
        </div>
        {earned ? (
          <Modal onClose={() => setEarned(null)}>
            <KeyModal keyName={KEY_LABEL[earned.key].chip} step={earned.step} />
          </Modal>
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
  const [theme] = useTheme()
  const choices = (
    <>
      {scene.choices.map((choice, i) => (
        <ChoiceCard
          key={choice.text}
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
      <Button size="l" onClick={onConfirm}>
        ПОДТВЕРДИТЬ ВЫБОР
      </Button>
    </div>
  )

  if (scene.chat) {
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

  return (
    <Page
      tone="chat"
      data-scene={n}
      className={[styles.photoPage, styles.photoQuizPage].join(' ')}
    >
      <div className={styles.photoFrame}>
        <SceneImage className={styles.bg} src={scene.photo!} theme={theme} />
      </div>
      <div className={styles.situationCard}>
        <Text variant="bodyL">{scene.situation}</Text>
      </div>
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

const DESKTOP = '(min-width: 600px)'

function desktopQuery() {
  return typeof window.matchMedia === 'function' ? window.matchMedia(DESKTOP) : null
}

function useDesktop() {
  const [desktop, setDesktop] = useState(() => desktopQuery()?.matches ?? false)

  useEffect(() => {
    const query = desktopQuery()
    if (!query) return
    const update = () => setDesktop(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return desktop
}

export function sceneImageSources(src: string, theme: Theme, desktop: boolean) {
  const suffixes = []
  if (desktop && theme === 'light') suffixes.push('-desktop-light')
  if (desktop) suffixes.push('-desktop')
  if (theme === 'light') suffixes.push('-light')
  suffixes.push('')
  return suffixes.map((suffix) => src.replace(/\.png$/, `${suffix}.png`))
}

function SceneImage({
  src,
  theme,
  className,
}: {
  src: string
  theme: Theme
  className?: string
}) {
  const desktop = useDesktop()
  const sources = sceneImageSources(src, theme, desktop)
  const [step, setStep] = useState(0)

  return (
    <img
      key={`${theme}-${desktop}`}
      className={className}
      src={sources[Math.min(step, sources.length - 1)]}
      alt=""
      onError={() => setStep((current) => current + 1)}
    />
  )
}

export function splitLead(text: string) {
  const i = text.indexOf(':')
  return i >= 0
    ? { lead: text.slice(0, i + 1), rest: text.slice(i + 1) }
    : { lead: '', rest: text }
}

function Remember({ text }: { text: string }) {
  const { lead, rest } = splitLead(text)
  return (
    <div className={styles.remember}>
      <Text variant="bodyL">
        <Text as="span" variant="bodyL" style={{ color: 'var(--color-lime)' }}>
          {lead}
        </Text>
        {rest}
      </Text>
    </div>
  )
}
