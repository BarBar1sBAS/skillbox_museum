import { beforeEach, describe, expect, it } from 'vitest'
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

  it('gives a key only when every scene of the block is correct', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'partial')
    expect(hasKey('trust')).toBe(false)

    saveAnswer(3, 'correct')
    expect(hasKey('trust')).toBe(true)
  })

  it('reports the key only on the last scene of its block', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    expect(keyEarnedAt(2)).toBeUndefined()

    saveAnswer(3, 'correct')
    expect(keyEarnedAt(3)).toBe('trust')

    saveAnswer(4, 'partial')
    saveAnswer(5, 'correct')
    saveAnswer(6, 'correct')
    expect(keyEarnedAt(6)).toBeUndefined()

    for (const n of [7, 8, 9, 10] as const) saveAnswer(n, 'correct')
    expect(keyEarnedAt(10)).toBe('access')
    expect(collectedKeys()).toEqual(['trust', 'access'])
  })
})
