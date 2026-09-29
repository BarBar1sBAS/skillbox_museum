import { KEY_BLOCKS, KEY_LABEL, type SceneKey } from './types.ts'
import { loadAnswers, POINTS, type SceneAnswers } from './progress.ts'

const KEYS = Object.keys(KEY_LABEL) as SceneKey[]

export const LEVELS = [
  {
    min: 0,
    title: 'Осваиваюсь в цифровом мире',
    body: 'Ты часто пользуешься цифровыми сервисами, но ещё учишься замечать и оценивать риски.',
  },
  {
    min: 30,
    title: 'Замечаю тревожные сигналы',
    body: 'Ты умеешь замечать подозрительные детали, но иногда не проверяешь их.',
  },
  {
    min: 60,
    title: 'Проверяю, прежде чем доверять',
    body: 'Ты умеешь остановиться и проверить информацию, но ещё не всегда делаешь это автоматически.',
  },
  {
    min: 80,
    title: 'Уверенно ориентируюсь',
    body: 'Ты замечаешь риски, проверяешь информацию и умеешь действовать безопасно — даже когда не всё так очевидно.',
  },
]

export function levelOf(score: number) {
  return LEVELS.findLast((level) => score >= level.min) ?? LEVELS[0]
}

export function keyScore(key: SceneKey, answers: SceneAnswers = loadAnswers()) {
  const block = KEY_BLOCKS[key]
  const got = block.reduce((sum, n) => sum + (answers[n] ? POINTS[answers[n]] : 0), 0)
  return Math.round((got / (block.length * POINTS.correct)) * 100)
}

export function keyScores(answers: SceneAnswers = loadAnswers()) {
  return KEYS.map((key) => ({ key, score: keyScore(key, answers) }))
}
