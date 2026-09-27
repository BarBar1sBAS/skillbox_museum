import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
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
  type SceneAnswers,
} from './index.ts'

describe('progress', () => {
  beforeEach(() => {
    resetProgress()
  })

  it('gives 10 / 4 / 0 points out of 100', () => {
    expect(POINTS).toEqual({ correct: 10, partial: 4, wrong: 0 })
    expect(MAX_SCORE).toBe(100)
  })

  it('sums points across scenes and keeps the last answer per scene', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'partial')
    saveAnswer(3, 'wrong')
    expect(totalScore()).toBe(14)

    saveAnswer(3, 'correct')
    expect(totalScore()).toBe(24)
    expect(safeDecisions()).toBe(2)
    expect(loadAnswers()).toEqual({ 1: 'correct', 2: 'partial', 3: 'correct' })
  })

  it('starts from zero after reset', () => {
    saveAnswer(1, 'correct')
    resetProgress()
    expect(loadAnswers()).toEqual({})
    expect(totalScore()).toBe(0)
  })

  it('gives a key for every three correct answers', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'partial')
    expect(hasKey('trust')).toBe(false)

    saveAnswer(4, 'correct')
    expect(hasKey('trust')).toBe(true)
    expect(collectedKeys()).toEqual(['trust'])
  })

  it('reports the key on the scene where the third correct answer lands', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    expect(keyEarnedAt(2)).toBeUndefined()

    saveAnswer(3, 'correct')
    expect(keyEarnedAt(3)).toBe('trust')

    // одна ошибка не мешает: ключи идут за 3-й, 6-й и 9-й верный ответ
    saveAnswer(4, 'wrong')
    for (const n of [5, 6, 7] as const) saveAnswer(n, 'correct')
    expect(keyEarnedAt(6)).toBeUndefined()
    expect(keyEarnedAt(7)).toBe('data')

    for (const n of [8, 9, 10] as const) saveAnswer(n, 'correct')
    expect(keyEarnedAt(10)).toBe('access')
    expect(collectedKeys()).toEqual(['trust', 'data', 'access'])
  })

  it('does not give a key on a partial answer', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'partial')
    expect(keyEarnedAt(3)).toBeUndefined()
    expect(collectedKeys()).toEqual([])
  })

  it('survives broken sessionStorage', () => {
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

  it('skips missing outcomes when summing', () => {
    expect(totalScore({ 1: undefined } as SceneAnswers)).toBe(0)
  })
})
