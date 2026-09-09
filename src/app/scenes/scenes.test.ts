import { describe, expect, it } from 'vitest'
import { parseSceneNumber, scenes } from './index.ts'

const OUTCOMES = ['correct', 'partial', 'wrong'] as const

describe('scenes', () => {
  it('has 10 scenes with 3 choices; 01–05 have situation and outcomes', () => {
    expect(Object.keys(scenes)).toHaveLength(10)

    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(scenes[n].n).toBe(n)
      expect(scenes[n].choices).toHaveLength(3)
    }

    for (const n of [1, 2, 3, 4, 5] as const) {
      expect(scenes[n].situation.length).toBeGreaterThan(0)
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
})
