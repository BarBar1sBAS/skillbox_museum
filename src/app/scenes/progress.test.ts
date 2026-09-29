import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  collectedKeys,
  keyEarnedAt,
  loadAnswers,
  MAX_SCORE,
  POINTS,
  resetProgress,
  safeDecisions,
  saveAnswer,
  totalScore,
  type SceneAnswers,
} from './index.ts'

describe('progress', () => {
  beforeEach(() => {
    resetProgress()
  })

  it('даёт 10 / 4 / 0 очков из 100', () => {
    expect(POINTS).toEqual({ correct: 10, partial: 4, wrong: 0 })
    expect(MAX_SCORE).toBe(100)
  })

  it('суммирует очки по сценам и хранит последний ответ на сцену', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'partial')
    saveAnswer(3, 'wrong')
    expect(totalScore()).toBe(14)

    saveAnswer(3, 'correct')
    expect(totalScore()).toBe(24)
    expect(safeDecisions()).toBe(2)
    expect(loadAnswers()).toEqual({ 1: 'correct', 2: 'partial', 3: 'correct' })
  })

  it('после сброса начинается с нуля', () => {
    saveAnswer(1, 'correct')
    resetProgress()
    expect(loadAnswers()).toEqual({})
    expect(totalScore()).toBe(0)
  })

  it('даёт ключ за каждые три верных ответа', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'partial')
    expect(collectedKeys().includes('trust')).toBe(false)

    saveAnswer(4, 'correct')
    expect(collectedKeys().includes('trust')).toBe(true)
    expect(collectedKeys()).toEqual(['trust'])
  })

  it('сообщает ключ на сцене, где выпал третий верный ответ', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    expect(keyEarnedAt(2)).toBeUndefined()

    saveAnswer(3, 'correct')
    expect(keyEarnedAt(3)).toBe('trust')

    saveAnswer(4, 'wrong')
    for (const n of [5, 6, 7] as const) saveAnswer(n, 'correct')
    expect(keyEarnedAt(6)).toBeUndefined()
    expect(keyEarnedAt(7)).toBe('data')

    for (const n of [8, 9, 10] as const) saveAnswer(n, 'correct')
    expect(keyEarnedAt(10)).toBe('access')
    expect(collectedKeys()).toEqual(['trust', 'data', 'access'])
  })

  it('не даёт ключ за неполный ответ', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'partial')
    expect(keyEarnedAt(3)).toBeUndefined()
    expect(collectedKeys()).toEqual([])
  })

  it('переживает сломанный sessionStorage', () => {
    sessionStorage.setItem('progress', '{')
    expect(loadAnswers()).toEqual({})

    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadAnswers()).toEqual({})
    getItem.mockRestore()

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(saveAnswer(1, 'correct')).toEqual({ 1: 'correct' })
    setItem.mockRestore()

    const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    resetProgress()
    removeItem.mockRestore()
  })

  it('пропускает отсутствующие исходы при суммировании', () => {
    expect(totalScore({ 1: undefined } as SceneAnswers)).toBe(0)
  })
})
