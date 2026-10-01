import { beforeEach, describe, expect, it } from 'vitest'
import {
  keyScore,
  keyScores,
  LEVELS,
  levelOf,
  resetProgress,
  saveAnswer,
} from './index.ts'

describe('stats', () => {
  beforeEach(() => {
    resetProgress()
  })

  it('оценивает пустой блок как 0, а полностью верный как 100', () => {
    expect(keyScore('trust')).toBe(0)
    expect(keyScore('data')).toBe(0)
    expect(keyScore('access')).toBe(0)

    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    saveAnswer(3, 'correct')
    expect(keyScore('trust')).toBe(100)
  })

  it('округляет частичные очки в блоке из 3 и из 4 сцен', () => {
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

  it('перечисляет очки ключей в порядке KEY_LABEL', () => {
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

  it('выбирает уровень по общему счёту на границах диапазонов', () => {
    expect(LEVELS).toHaveLength(4)
    expect(levelOf(-1).title).toBe(LEVELS[0].title)
    expect(levelOf(0).title).toBe('Осваиваюсь в цифровом мире')
    expect(levelOf(29).title).toBe('Осваиваюсь в цифровом мире')
    expect(levelOf(30).title).toBe('Замечаю тревожные сигналы')
    expect(levelOf(59).title).toBe('Замечаю тревожные сигналы')
    expect(levelOf(60).title).toBe('Проверяю, прежде чем доверять')
    expect(levelOf(79).title).toBe('Проверяю, прежде чем доверять')
    expect(levelOf(80).title).toBe('Уверенно ориентируюсь')
    expect(levelOf(100).title).toBe('Уверенно ориентируюсь')
  })
})
