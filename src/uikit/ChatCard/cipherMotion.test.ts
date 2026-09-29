import { describe, expect, it } from 'vitest'
import { decodeFrame, runBits, runShapes } from './cipherMotion.ts'

const sorted = (s: string) => [...s].sort().join('')

describe('cipherMotion', () => {
  it('сдвигает фигуры, а пробелы оставляет на месте', () => {
    const line = '◈ □ △ ◇  ◈ □'
    expect(runShapes(line, 0)).toBe(line)
    const next = runShapes(line, 1)
    expect(next).toBe('□ △ ◇ ◈  □ ◈')
    expect([...next].map((c) => c === ' ')).toEqual([...line].map((c) => c === ' '))
  })

  it('гонит код по кругу, не меняя символы и длину', () => {
    const line = '0101^0110001”;1001”00@1!1001**10'
    const next = runBits(line, 7)
    expect(next).toHaveLength(line.length)
    expect(sorted(next.replace(/[01]/g, ''))).toBe(sorted(line.replace(/[01]/g, '')))
  })

  it('расшифровывает текст слева направо и сохраняет пробелы', () => {
    expect(decodeFrame('ab cd', 5)).toBe('ab cd')
    const frame = decodeFrame('ab cd', 2)
    expect(frame.slice(0, 3)).toBe('ab ')
    expect(frame).toHaveLength(5)
  })
})
