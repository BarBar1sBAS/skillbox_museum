import type { SceneNumber } from '@/uikit/index.ts'

export type SceneKey = 'trust' | 'data' | 'access'
export type SceneOutcome = 'correct' | 'partial' | 'wrong'
export type SceneQuiz = 'chat' | 'photo'

export type SceneResult = {
  eyebrow: string
  title: string
  body: string
  remember: string
  keyLine: string
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

export type SceneContent = {
  n: SceneNumber
  key: SceneKey
  quiz: SceneQuiz
  intro?: SceneIntro
  photo?: string
  situation: string
  choices: [SceneChoice, SceneChoice, SceneChoice]
  results: Record<SceneOutcome, SceneResult>
}

const EMPTY_RESULT: SceneResult = {
  eyebrow: '',
  title: '',
  body: '',
  remember: '',
  keyLine: '',
}

export function emptyScene(n: SceneNumber): SceneContent {
  return {
    n,
    key: 'access',
    quiz: 'photo',
    situation: '',
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
