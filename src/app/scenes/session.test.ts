import { afterEach, expect, it, vi } from 'vitest'
import { loadSceneSession, saveSceneSession, SESSION_KEY } from './session'
afterEach(() => {
  sessionStorage.clear()
  vi.restoreAllMocks()
})
it('сохраняет этапы и выбранные ответы отдельно для сцен', () => {
  saveSceneSession(1, { step: 'quiz', picked: 2 })
  saveSceneSession(2, { step: 'intro', picked: null })
  expect(loadSceneSession(1)).toEqual({ step: 'quiz', picked: 2 })
  expect(loadSceneSession(2)).toEqual({ step: 'intro', picked: null })
})
it.each([
  '{',
  'null',
  '{"1":{"step":"other","picked":0}}',
  '{"1":{"step":"quiz","picked":9}}',
])('игнорирует повреждённое состояние %s', (value) => {
  sessionStorage.setItem(SESSION_KEY, value)
  expect(loadSceneSession(1)).toBeNull()
  saveSceneSession(1, { step: 'quiz', picked: 1 })
  expect(loadSceneSession(1)).toEqual({ step: 'quiz', picked: 1 })
})
it('не ломает игру при запрете хранилища', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw Error('denied')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('denied')
  })
  expect(loadSceneSession(1)).toBeNull()
  expect(() => saveSceneSession(1, { step: 'quiz', picked: 0 })).not.toThrow()
})
