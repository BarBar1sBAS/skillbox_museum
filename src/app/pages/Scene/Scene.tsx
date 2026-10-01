import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { startRun } from '@/app/stats/track'
import {
  collectedKeys,
  KEY_LABEL,
  keyEarnedAt,
  loadAnswers,
  parseSceneNumber,
  resultCopy,
  saveAnswer,
  scenes,
} from '@/app/scenes'
import type { SceneKey } from '@/app/scenes/types'
import {
  loadSceneSession,
  saveSceneSession,
  type SceneSession,
} from '@/app/scenes/session'
import { sceneVisual } from '@/app/scenes/visuals'
import { useTheme } from '@/app/theme'
import {
  Button,
  ChatBubble,
  ChoiceCard,
  KeyModal,
  Modal,
  Page,
  Text,
  VoiceBubble,
  type KeyStep,
  type SceneNumber,
} from '@/uikit'
import { MuseumHeader } from '@/app/MuseumHeader'
import { PixelScene } from '@/uikit/PixelScene/PixelScene'
import styles from './Scene.module.scss'

export function Scene() {
  const { n: raw } = useParams()
  const n = parseSceneNumber(raw)
  if (n == null) return <Navigate to="/rules" replace />
  return <ScenePlay key={n} n={n} />
}
function ScenePlay({ n }: { n: SceneNumber }) {
  const [theme] = useTheme()
  const navigate = useNavigate()
  const scene = scenes[n]
  const [session, setSession] = useState<SceneSession>(() => {
    const saved = loadSceneSession(n)
    const answer = loadAnswers()[n]
    if (answer)
      return {
        step: 'result',
        picked: scene.choices.findIndex((c) => c.outcome === answer) as
          0 | 1 | 2,
      }
    if (saved && saved.step !== 'result') return saved
    return { step: scene.intro ? 'intro' : 'quiz', picked: null }
  })
  const { step, picked } = session
  const [earned, setEarned] = useState<{ key: SceneKey; step: KeyStep } | null>(
    null,
  )
  const heading = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (n === 1) void startRun()
  }, [n])
  useEffect(() => {
    saveSceneSession(n, session)
  }, [n, session])
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [step])
  const outcome = picked == null ? null : scene.choices[picked].outcome
  const result =
    step === 'result' && outcome ? resultCopy(scene, outcome) : null
  const visual = sceneVisual(n, step === 'intro' ? 'intro' : 'quiz', theme)
  function confirm(picked: 0 | 1 | 2) {
    const chosen = scene.choices[picked].outcome
    const saved = loadAnswers()
    const alreadyConfirmed = saved[n] !== undefined
    const answers = alreadyConfirmed ? saved : saveAnswer(n, chosen)
    const key = alreadyConfirmed ? undefined : keyEarnedAt(n, answers)
    setEarned(
      key ? { key, step: collectedKeys(answers).length as KeyStep } : null,
    )
    setSession({ step: 'result', picked })
  }
  return (
    <Page className={styles.page}>
      <MuseumHeader n={n} />
      <div className={styles.progress}>
        <span>СЦЕНА {String(n).padStart(2, '0')} / 10</span>
        <span>Ключи {collectedKeys().length} / 3</span>
      </div>
      <div className={styles.layout}>
        <aside className={styles.visual}>
          <PixelScene {...visual} priority />
          <p className={styles.caption}>
            Один день в цифровом мире / {String(n).padStart(2, '0')}
          </p>
        </aside>
        <section className={styles.content}>
          <div ref={heading} tabIndex={-1} className={styles.heading}>
            {step === 'intro' && scene.intro ? (
              <>
                {scene.intro.kicker && (
                  <p className={styles.kicker}>{scene.intro.kicker}</p>
                )}
                <Text as="h1" variant="h1">
                  {scene.intro.title.replaceAll('\n', ' ')}
                </Text>
              </>
            ) : (
              <Text as="h1" variant="h1">
                {result ? result.title : 'Как ты поступишь?'}
              </Text>
            )}
          </div>
          {step === 'intro' && scene.intro ? (
            <div className={styles.cta}>
              <Button
                arrow
                onClick={() => setSession({ step: 'quiz', picked: null })}
              >
                {scene.intro.cta}
              </Button>
            </div>
          ) : result && outcome ? (
            <>
              <p className={styles.status} data-outcome={outcome}>
                {result.eyebrow}
              </p>
              <Text variant="bodyM">{result.body}</Text>
              <Remember text={result.remember} />
              <p className={styles.keyLine}>{result.keyLine}</p>
              <Button
                arrow
                onClick={() => navigate(n < 10 ? `/scene/${n + 1}` : '/result')}
              >
                {n < 10 ? 'ПРОДОЛЖИТЬ' : 'УЗНАТЬ РЕЗУЛЬТАТ'}
              </Button>
            </>
          ) : (
            <>
              {scene.chat ? (
                <div className={styles.thread}>
                  <div className={styles.chatHeader}>
                    <button
                      type="button"
                      aria-label="Назад"
                      onClick={() => navigate('/rules')}
                    >
                      ←
                    </button>
                    <strong>{scene.chat.name}</strong>
                    <span>{scene.chat.status}</span>
                  </div>
                  {scene.chat.messages.map((m) =>
                    m.kind === 'voice' ? (
                      <VoiceBubble
                        key={m.text}
                        duration={m.duration}
                        time={m.time}
                      >
                        {m.text}
                      </VoiceBubble>
                    ) : (
                      <ChatBubble key={m.text} time={m.time}>
                        {m.text}
                      </ChatBubble>
                    ),
                  )}
                </div>
              ) : (
                <p className={styles.situation}>{scene.situation}</p>
              )}
              <fieldset className={styles.choices}>
                <legend className={styles.srOnly}>Выбери одно действие</legend>
                {scene.choices.map((choice, i) => (
                  <ChoiceCard
                    key={choice.text}
                    name={`scene-${n}`}
                    selected={picked === i}
                    onClick={() =>
                      setSession({ step: 'quiz', picked: i as 0 | 1 | 2 })
                    }
                  >
                    {choice.text}
                  </ChoiceCard>
                ))}
              </fieldset>
              <Button
                disabled={picked == null}
                arrow
                onClick={picked == null ? undefined : () => confirm(picked)}
              >
                ПОДТВЕРДИТЬ ВЫБОР
              </Button>
            </>
          )}
        </section>
      </div>
      {earned && (
        <Modal onClose={() => setEarned(null)}>
          <KeyModal
            keyName={KEY_LABEL[earned.key].chip}
            step={earned.step}
            onClose={() => setEarned(null)}
          />
        </Modal>
      )}
    </Page>
  )
}
function splitLead(text: string) {
  const i = text.indexOf(':')
  return i >= 0
    ? { lead: text.slice(0, i + 1), rest: text.slice(i + 1) }
    : { lead: '', rest: text }
}
function Remember({ text }: { text: string }) {
  const { lead, rest } = splitLead(text)
  return (
    <p className={styles.remember}>
      <strong>{lead}</strong>
      {rest}
    </p>
  )
}
