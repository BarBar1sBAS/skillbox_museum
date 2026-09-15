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

export function saveAnswer(n: SceneNumber, outcome: SceneOutcome): SceneAnswers {
  const answers = { ...loadAnswers(), [n]: outcome }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    return answers
  }
  return answers
}

export function resetProgress() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
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
  return Object.values(answers).filter((outcome) => outcome === 'correct').length
}

export function hasKey(key: SceneKey, answers: SceneAnswers = loadAnswers()) {
  return KEY_BLOCKS[key].every((n) => answers[n] === 'correct')
}

export function collectedKeys(answers: SceneAnswers = loadAnswers()) {
  return KEYS.filter((key) => hasKey(key, answers))
}

export function keyEarnedAt(
  n: SceneNumber,
  answers: SceneAnswers = loadAnswers(),
): SceneKey | undefined {
  const key = KEYS.find((k) => {
    const block = KEY_BLOCKS[k]
    return block[block.length - 1] === n
  })
  return key && hasKey(key, answers) ? key : undefined
}
