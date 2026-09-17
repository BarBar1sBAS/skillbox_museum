import { describe, expect, it } from 'vitest'
import { KEY_BLOCKS, keyOf, parseSceneNumber, resultCopy, scenes } from './index.ts'

const OUTCOMES = ['correct', 'partial', 'wrong'] as const

describe('scenes', () => {
  it('has 10 scenes with 3 choices, situation and outcomes', () => {
    expect(Object.keys(scenes)).toHaveLength(10)

    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(scenes[n].n).toBe(n)
      expect(scenes[n].choices).toHaveLength(3)
      expect(scenes[n].situation.length).toBeGreaterThan(0)
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
  })

  it('splits scenes into key blocks 1–3, 4–6, 7–10', () => {
    expect(KEY_BLOCKS).toEqual({
      trust: [1, 2, 3],
      data: [4, 5, 6],
      access: [7, 8, 9, 10],
    })
    expect(keyOf(3)).toBe('trust')
    expect(keyOf(4)).toBe('data')
    expect(keyOf(10)).toBe('access')
  })

  it('gives a key fragment only for a correct answer', () => {
    expect(resultCopy(scenes[1], 'correct').keyLine).toBe(
      'Фрагмент ключа “Доверие” получен',
    )
    expect(resultCopy(scenes[1], 'partial').keyLine).toBe(
      'Фрагмент ключа “Доверие” не получен',
    )
    expect(resultCopy(scenes[5], 'partial').keyLine).toBe(
      'Фрагмент ключа “Данные” не получен',
    )
    expect(resultCopy(scenes[7], 'correct').keyLine).toBe(
      'Фрагмент ключа “Доступ” получен',
    )
  })
})
