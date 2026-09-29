import { describe, expect, it } from 'vitest'
import { KEY_BLOCKS, parseSceneNumber, resultCopy, scenes } from './index.ts'

const OUTCOMES = ['correct', 'partial', 'wrong'] as const

describe('scenes', () => {
  it('содержит 10 сцен с 3 вариантами, ситуацией и исходами', () => {
    expect(Object.keys(scenes)).toHaveLength(10)

    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(scenes[n].n).toBe(n)
      expect(scenes[n].choices).toHaveLength(3)
      if (n !== 10) expect(scenes[n].situation.length).toBeGreaterThan(0)
      expect(scenes[n].remember.length).toBeGreaterThan(0)
      for (const choice of scenes[n].choices) {
        expect(choice.text.length).toBeGreaterThan(0)
        expect(OUTCOMES).toContain(choice.outcome)
      }
    }

    expect(parseSceneNumber('1')).toBe(1)
    expect(parseSceneNumber('10')).toBe(10)
    expect(parseSceneNumber('0')).toBeUndefined()
    expect(parseSceneNumber('11')).toBeUndefined()
    expect(parseSceneNumber(undefined)).toBeUndefined()
  })

  it('делит сцены на блоки ключей 1–3, 4–6, 7–10', () => {
    expect(KEY_BLOCKS).toEqual({
      trust: [1, 2, 3],
      data: [4, 5, 6],
      access: [7, 8, 9, 10],
    })
  })

  it('даёт фрагмент ключа только за верный ответ', () => {
    expect(resultCopy(scenes[1], 'correct').keyLine).toBe('Фрагмент ключа получен')
    expect(resultCopy(scenes[1], 'partial').keyLine).toBe('Фрагмент ключа не получен')
    expect(resultCopy(scenes[5], 'wrong').keyLine).toBe('Фрагмент ключа не получен')
    expect(resultCopy(scenes[7], 'correct').keyLine).toBe('Фрагмент ключа получен')
    expect(
      resultCopy(
        {
          ...scenes[1],
          results: {
            ...scenes[1].results,
            correct: { ...scenes[1].results.correct, keyLine: 'свой текст' },
          },
        },
        'correct',
      ).keyLine,
    ).toBe('свой текст')
  })
})
