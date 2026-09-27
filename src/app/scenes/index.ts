import type { SceneNumber } from '@/uikit/index.ts'
import { scene as scene01 } from './01/scene.ts'
import { scene as scene02 } from './02/scene.ts'
import { scene as scene03 } from './03/scene.ts'
import { scene as scene04 } from './04/scene.ts'
import { scene as scene05 } from './05/scene.ts'
import { scene as scene06 } from './06/scene.ts'
import { scene as scene07 } from './07/scene.ts'
import { scene as scene08 } from './08/scene.ts'
import { scene as scene09 } from './09/scene.ts'
import { scene as scene10 } from './10/scene.ts'
import type { SceneContent } from './types.ts'

export type {
  SceneChat,
  SceneChatMessage,
  SceneChoice,
  SceneContent,
  SceneKey,
  SceneOutcome,
  SceneResult,
} from './types.ts'
export { KEY_BLOCKS, KEY_LABEL, keyOf, resultCopy } from './types.ts'
export type { SceneAnswers } from './progress.ts'
export {
  collectedKeys,
  hasKey,
  keyEarnedAt,
  loadAnswers,
  MAX_SCORE,
  POINTS,
  resetProgress,
  safeDecisions,
  saveAnswer,
  totalScore,
} from './progress.ts'
export { GROWTH, INSIGHT, keyScore, keyScores, strongestKey, weakestKey } from './stats.ts'

export const scenes: Record<SceneNumber, SceneContent> = {
  1: scene01,
  2: scene02,
  3: scene03,
  4: scene04,
  5: scene05,
  6: scene06,
  7: scene07,
  8: scene08,
  9: scene09,
  10: scene10,
}

export function parseSceneNumber(raw: string | undefined): SceneNumber | undefined {
  const n = Number(raw)
  if (n in scenes) return n as SceneNumber
}
