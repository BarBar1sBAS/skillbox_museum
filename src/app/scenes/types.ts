import type { SceneNumber } from '@/uikit/index.ts'

export type SceneKey = 'trust' | 'data' | 'access'
export type SceneOutcome = 'correct' | 'partial' | 'wrong'
export type SceneQuiz = 'chat' | 'photo'

export const KEY_LABEL = {
  trust: { chip: 'ДОВЕРИЕ', line: 'Доверие' },
  data: { chip: 'ДАННЫЕ', line: 'Данные' },
  access: { chip: 'ДОСТУП', line: 'Доступ' },
} as const

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
  title: string
  cta: string
  image: string
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
  key: SceneKey
  quiz: SceneQuiz
  intro?: SceneIntro
  photo?: string
  chat?: SceneChat
  situation: string
  remember: string
  choices: [SceneChoice, SceneChoice, SceneChoice]
  results: Record<SceneOutcome, SceneResult>
}

export function resultCopy(scene: SceneContent, outcome: SceneOutcome) {
  const got = outcome !== 'wrong'
  return {
    eyebrow: EYEBROW[outcome],
    title: scene.results[outcome].title,
    body: scene.results[outcome].body,
    remember: scene.remember,
    keyLine:
      scene.results[outcome].keyLine ??
      `Фрагмент ключа “${KEY_LABEL[scene.key].line}” ${got ? 'получен' : 'не получен'}`,
  }
}

const EMPTY_RESULT: SceneResult = { title: '', body: '' }

export function emptyScene(n: SceneNumber): SceneContent {
  return {
    n,
    key: 'access',
    quiz: 'photo',
    situation: '',
    remember: '',
    choices: [
      { text: '', outcome: 'correct' },
      { text: '', outcome: 'partial' },
      { text: '', outcome: 'wrong' },
    ],
    results: {
      correct: EMPTY_RESULT,
      partial: EMPTY_RESULT,
      wrong: EMPTY_RESULT,
    },
  }
}
