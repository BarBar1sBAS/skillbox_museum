import { KEY_BLOCKS, KEY_LABEL, type SceneKey } from './types.ts'
import { loadAnswers, POINTS, type SceneAnswers } from './progress.ts'

const KEYS = Object.keys(KEY_LABEL) as SceneKey[]

export const INSIGHT: Record<SceneKey, { title: string; body: string }> = {
  trust: {
    title: 'Ты умеешь распознавать обман',
    body: 'Ты хорошо замечаешь фишинг и осторожен с банковскими операциями.',
  },
  data: {
    title: 'Ты бережно относишься к данным',
    body: 'Ты не отдаёшь личное без причины и следишь за тем, что сохраняется на устройстве.',
  },
  access: {
    title: 'Ты контролируешь доступ',
    body: 'Ты осторожен с подключениями и не оставляешь приложения без проверки.',
  },
}

export const GROWTH: Record<SceneKey, string> = {
  trust: 'фишинг и банковские операции',
  data: 'хранение паролей и обмен файлами',
  access: 'публичный Wi-Fi и разрешения приложений',
}

export function keyScore(key: SceneKey, answers: SceneAnswers = loadAnswers()) {
  const block = KEY_BLOCKS[key]
  const got = block.reduce((sum, n) => sum + (answers[n] ? POINTS[answers[n]] : 0), 0)
  return Math.round((got / (block.length * POINTS.correct)) * 100)
}

export function keyScores(answers: SceneAnswers = loadAnswers()) {
  return KEYS.map((key) => ({ key, score: keyScore(key, answers) }))
}

export function strongestKey(answers: SceneAnswers = loadAnswers()) {
  return keyScores(answers).reduce((best, next) => (next.score > best.score ? next : best)).key
}

export function weakestKey(answers: SceneAnswers = loadAnswers()) {
  return keyScores(answers).reduce((worst, next) => (next.score < worst.score ? next : worst)).key
}
