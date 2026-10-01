import type { SceneNumber } from '@/uikit/ScenePill/ScenePill'
export type SceneStep = 'intro' | 'quiz' | 'result'
export type SceneSession = { step: SceneStep; picked: 0 | 1 | 2 | null }
export const SESSION_KEY = 'scene-session-v1'
export function loadSceneSession(n: SceneNumber): SceneSession | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}')[n]
    if (
      !value ||
      !['intro', 'quiz', 'result'].includes(value.step) ||
      ![null, 0, 1, 2].includes(value.picked)
    )
      return null
    return value
  } catch {
    return null
  }
}
export function saveSceneSession(n: SceneNumber, value: SceneSession) {
  try {
    let sessions
    try {
      sessions = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}')
    } catch {
      sessions = {}
    }
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...sessions, [n]: value }),
    )
  } catch {
    /* Game remains playable if storage is unavailable. */
  }
}
