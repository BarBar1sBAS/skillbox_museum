import { SESSION_KEY } from './session'
import { clearRunId, reportAnswer } from '@/app/stats/track.ts'
import type { SceneNumber } from '@/uikit/index.ts'
import { KEY_BLOCKS, type SceneKey, type SceneOutcome } from './types.ts'

export const POINTS: Record<SceneOutcome, number> = {
  correct: 10,
  partial: 4,
  wrong: 0,
}

export const MAX_SCORE = POINTS.correct * 10

export type SceneAnswers = Partial<Record<SceneNumber, SceneOutcome>>

const STORAGE_KEY = 'progress'

const KEYS = Object.keys(KEY_BLOCKS) as SceneKey[]

export function loadAnswers(): SceneAnswers {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SceneAnswers) : {}
  } catch {
    return {}
  }
}

export function saveAnswer(
  n: SceneNumber,
  outcome: SceneOutcome,
): SceneAnswers {
  const answers = { ...loadAnswers(), [n]: outcome }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    return answers
  }
  reportAnswer(n, outcome)
  return answers
}

export function resetProgress() {
  clearRunId()
  try {
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    return
  }
}

export function totalScore(answers: SceneAnswers = loadAnswers()) {
  return Object.values(answers).reduce(
    (sum, outcome) => sum + (outcome ? POINTS[outcome] : 0),
    0,
  )
}

export function safeDecisions(answers: SceneAnswers = loadAnswers()) {
  return Object.values(answers).filter((outcome) => outcome === 'correct')
    .length
}

const ANSWERS_PER_KEY = 3

function correctUpTo(answers: SceneAnswers, n: SceneNumber = 10) {
  return Object.entries(answers).filter(
    ([scene, outcome]) => Number(scene) <= n && outcome === 'correct',
  ).length
}

export function collectedKeys(answers: SceneAnswers = loadAnswers()) {
  return KEYS.slice(0, Math.floor(correctUpTo(answers) / ANSWERS_PER_KEY))
}

export function keyEarnedAt(
  n: SceneNumber,
  answers: SceneAnswers = loadAnswers(),
): SceneKey | undefined {
  if (answers[n] !== 'correct') return undefined
  const correct = correctUpTo(answers, n)
  if (correct % ANSWERS_PER_KEY) return undefined
  return KEYS[correct / ANSWERS_PER_KEY - 1]
}
