import type { SceneNumber } from '@/uikit/index.ts'

export type SceneKey = 'trust' | 'data' | 'access'
export type SceneOutcome = 'correct' | 'partial' | 'wrong'

export const KEY_LABEL = {
  trust: { chip: 'ДОВЕРИЕ', line: 'Доверие' },
  data: { chip: 'ДАННЫЕ', line: 'Данные' },
  access: { chip: 'ДОСТУП', line: 'Доступ' },
} as const

export const KEY_BLOCKS: Record<SceneKey, SceneNumber[]> = {
  trust: [1, 2, 3],
  data: [4, 5, 6],
  access: [7, 8, 9, 10],
}

const EYEBROW: Record<SceneOutcome, string> = {
  correct: 'ВЕРНОЕ РЕШЕНИЕ',
  partial: 'НЕ СОВСЕМ ПРАВИЛЬНО',
  wrong: 'НЕВЕРНОЕ РЕШЕНИЕ',
}

export type SceneResult = {
  title: string
  body: string
  keyLine?: string
}

export type SceneChoice = {
  text: string
  outcome: SceneOutcome
}

export type SceneIntro = {
  kicker?: string
  title: string
  cta: string
}

export type SceneChatMessage =
  | { kind: 'voice'; duration: string; time: string; text: string }
  | { kind: 'text'; time: string; text: string }

export type SceneChat = {
  name: string
  status: string
  messages: SceneChatMessage[]
}

export type SceneContent = {
  n: SceneNumber
  intro?: SceneIntro
  chat?: SceneChat
  situation: string
  remember: string
  choices: [SceneChoice, SceneChoice, SceneChoice]
  results: Record<SceneOutcome, SceneResult>
}

export function resultCopy(scene: SceneContent, outcome: SceneOutcome) {
  const got = outcome === 'correct'
  return {
    eyebrow: EYEBROW[outcome],
    title: scene.results[outcome].title,
    body: scene.results[outcome].body,
    remember: scene.remember,
    keyLine:
      scene.results[outcome].keyLine ??
      `Фрагмент ключа ${got ? 'получен' : 'не получен'}`,
  }
}

