import { beforeEach, describe, expect, it } from 'vitest'
import {
  GROWTH,
  INSIGHT,
  keyScore,
  keyScores,
  resetProgress,
  saveAnswer,
  strongestKey,
  weakestKey,
} from './index.ts'

describe('stats', () => {
  beforeEach(() => {
    resetProgress()
  })

  it('scores an empty block as 0 and a full correct block as 100', () => {
    expect(keyScore('trust')).toBe(0)
    expect(keyScore('data')).toBe(0)
    expect(keyScore('access')).toBe(0)

    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'correct')
    expect(keyScore('trust')).toBe(100)
  })

  it('rounds partial points in a 3-scene block and a 4-scene block', () => {
    saveAnswer(1, 'partial')
    saveAnswer(2, 'partial')
    saveAnswer(3, 'partial')
    expect(keyScore('trust')).toBe(40)

    saveAnswer(7, 'correct')
    saveAnswer(8, 'correct')
    saveAnswer(9, 'partial')
    saveAnswer(10, 'wrong')
    expect(keyScore('access')).toBe(60)
  })

  it('lists key scores in KEY_LABEL order', () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'correct')
    saveAnswer(4, 'partial')
    expect(keyScores()).toEqual([
      { key: 'trust', score: 100 },
      { key: 'data', score: 13 },
      { key: 'access', score: 0 },
    ])
  })

  it('picks strongest and weakest keys, breaking ties by KEY_LABEL order', () => {
    expect(strongestKey()).toBe('trust')
    expect(weakestKey()).toBe('trust')

    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'correct')
    saveAnswer(7, 'correct')
    saveAnswer(8, 'correct')
    saveAnswer(9, 'partial')
    saveAnswer(10, 'wrong')
    expect(strongestKey()).toBe('trust')
    expect(weakestKey()).toBe('data')
  })

  it('has insight and growth copy for every key', () => {
    expect(INSIGHT.trust.title).toBe('Ты умеешь распознавать обман')
    expect(GROWTH.access).toBe('публичный Wi-Fi и разрешения приложений')
    expect(Object.keys(INSIGHT)).toEqual(['trust', 'data', 'access'])
    expect(Object.keys(GROWTH)).toEqual(['trust', 'data', 'access'])
  })
})
