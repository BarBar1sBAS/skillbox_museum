import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { parseSceneNumber, scenes } from '@/app/scenes/index.ts'
import type { SceneContent, SceneKey, SceneOutcome } from '@/app/scenes/types.ts'
import type { KeyStep, SceneNumber } from '@/uikit/index.ts'
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
  VoiceBubble,
  type StatusTone,
} from '@/uikit/index.ts'
import styles from './Scene.module.scss'

const TONE: Record<SceneOutcome, StatusTone> = {
  correct: 'lime',
  partial: 'orange',
  wrong: 'red',
}

const EYEBROW: Record<SceneOutcome, string> = {
  correct: 'var(--color-lime)',
  partial: 'var(--color-orange)',
  wrong: 'var(--color-red)',
}

const KEY_NAME: Record<SceneKey, string> = {
  trust: 'ДОВЕРИЕ',
  data: 'ДАННЫЕ',
  access: 'ДОСТУП',
}

function keyStep(n: SceneNumber, key: SceneKey): KeyStep {
  let step = 0
  for (let i = 1; i <= n; i++) {
    if (scenes[i as SceneNumber].key === key) step++
  }
  return (step === 2 || step === 3 ? step : 1)
}

type Step = 'intro' | 'quiz' | 'result'

export function Scene() {
  const { n: raw } = useParams()
  const n = parseSceneNumber(raw)
  if (n == null) return <Navigate to="/rules" replace />
  return <ScenePlay key={n} n={n} />
}

function ScenePlay({ n }: { n: SceneNumber }) {
  const navigate = useNavigate()
  const scene = scenes[n]
  const [step, setStep] = useState<Step>(scene.intro ? 'intro' : 'quiz')
  const [picked, setPicked] = useState<0 | 1 | 2 | null>(null)
  const [showKey, setShowKey] = useState(false)
  const outcome = picked != null ? scene.choices[picked].outcome : null
  const result = step === 'result' && outcome ? scene.results[outcome] : null

  if (step === 'intro' && scene.intro) {
    return (
      <Page
        tone="chat"
        className={[
          styles.photoPage,
          styles.introPage,
          n === 3 && styles.introPage3,
          n === 4 && styles.introPage4,
          n === 5 && styles.introPage5,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <img className={styles.bg} src={scene.intro.image} alt="" />
        <header className={styles.photoHeader}>
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
          <StatusMark tone={TONE[outcome]} />
        </div>
        <Text
          variant="eyebrow"
          className={styles.resultEyebrow}
          style={{ color: EYEBROW[outcome] }}
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
              style={{ ['--tone' as string]: EYEBROW[outcome] }}
            />
            <Text as="span" variant="h4">
              {result.keyLine}
            </Text>
          </div>
        ) : null}
        {n < 10 ? (
          <div className={styles.cta}>
            <Button onClick={() => navigate(`/scene/${n + 1}`)}>ПРОДОЛЖИТЬ</Button>
          </div>
        ) : null}
        {showKey ? (
          <div
            className={styles.keyOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowKey(false)
            }}
          >
            <KeyModal keyName={KEY_NAME[scene.key]} step={keyStep(n, scene.key)} />
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
          setShowKey(scene.choices[picked].outcome === 'correct')
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

  if (scene.quiz === 'chat') {
    return (
      <Page tone="chat" className={styles.chatPage}>
        <ChatHeader name="Друг" status="в сети" onBack={() => navigate('/rules')} />
        <Text variant="bodyS" className={styles.today}>
          Сегодня
        </Text>
        <div className={styles.thread}>
          <VoiceBubble duration="00:05" time="08:00">
            Бро, привет, скинь 2000, пожалуйста, вечером верну.
          </VoiceBubble>
          <ChatBubble time="08:00">По этому номеру 8808080808</ChatBubble>
          <ChatBubble time="08:01">Это новый, я поменял</ChatBubble>
        </div>
        <div className={styles.chatQuiz}>
          <Text as="h1" variant="h1">
            Как ты поступишь?
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
        className={[
          styles.photoPage,
          styles.photoQuizPage,
          n === 3 && styles.photoQuizPage3,
          n === 4 && styles.photoQuizPage4,
          n === 5 && styles.photoQuizPage5,
        ]
          .filter(Boolean)
          .join(' ')}
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
            Как ты поступишь?
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
          Как ты поступишь?
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
