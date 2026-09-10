import type { SceneNumber } from '@/uikit/index.ts'
import { scene as scene01 } from './01/scene.ts'
import { scene as scene02 } from './02/scene.ts'
import { scene as scene03 } from './03/scene.ts'
import { scene as scene04 } from './04/scene.ts'
import { scene as scene05 } from './05/scene.ts'
import { emptyScene, type SceneContent } from './types.ts'

export type {
  SceneChat,
  SceneChatMessage,
  SceneChoice,
  SceneContent,
  SceneKey,
  SceneOutcome,
  SceneResult,
} from './types.ts'
export { emptyScene, KEY_LABEL, resultCopy } from './types.ts'

export const scenes: Record<SceneNumber, SceneContent> = {
  1: scene01,
  2: scene02,
  3: scene03,
  4: scene04,
  5: scene05,
  6: emptyScene(6),
  7: emptyScene(7),
  8: emptyScene(8),
  9: emptyScene(9),
  10: emptyScene(10),
}

export function parseSceneNumber(raw: string | undefined): SceneNumber | undefined {
  const n = Number(raw)
  if (n in scenes) return n as SceneNumber
}
