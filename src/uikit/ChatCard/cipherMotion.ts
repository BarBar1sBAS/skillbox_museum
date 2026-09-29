import { useEffect, useState } from 'react'

// анимация шифра: строки бегут по кругу, цифры мигают, расшифровка
// проявляется из шума. Всё считается от номера шага, без Math.random,
// поэтому рендер остаётся чистым, а тесты — предсказуемыми

const NOISE = '01◈□△◇*@!'

function reducedMotion() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// псевдослучайное число для символа i на шаге tick
function noise(i: number, tick: number) {
  return (Math.imul(i + 1, 73856093) ^ Math.imul(tick + 1, 19349663)) >>> 0
}

// счётчик шагов; при «уменьшить движение» в системе стоит на месте
export function useTick(ms: number) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => setTick((t) => t + 1), ms)
    return () => clearInterval(id)
  }, [ms])

  return tick
}

// фигуры сдвигаются по своим местам, пробелы между группами остаются на месте
export function runShapes(line: string, tick: number) {
  const chars = [...line]
  const cells = chars.flatMap((c, i) => (c === ' ' ? [] : [i]))
  const shift = tick % cells.length
  const next = [...chars]
  cells.forEach((at, k) => {
    next[at] = chars[cells[(k + shift) % cells.length]]
  })
  return next.join('')
}

// строка бежит влево по кругу (ширина не меняется — набор символов тот же),
// часть цифр на каждом шаге меняется 0 ↔ 1
export function runBits(line: string, tick: number) {
  const chars = [...line]
  const shift = tick % chars.length
  return [...chars.slice(shift), ...chars.slice(0, shift)]
    .map((c, i) => {
      if (c !== '0' && c !== '1') return c
      if (noise(i, tick) % 5) return c
      return c === '0' ? '1' : '0'
    })
    .join('')
}

// сколько символов текста уже «расшифровано»: растёт до длины текста
export function useDecoded(length: number) {
  const [shown, setShown] = useState(() => (reducedMotion() ? length : 0))

  useEffect(() => {
    if (shown >= length) return
    const id = setTimeout(() => setShown((s) => Math.min(length, s + 2)), 35)
    return () => clearTimeout(id)
  }, [shown, length])

  return shown
}

// первые shown символов настоящие, остальные — шум; пробелы не трогаем
export function decodeFrame(text: string, shown: number) {
  return [...text]
    .map((c, i) => {
      if (i < shown || c === ' ') return c
      return NOISE[noise(i, shown) % NOISE.length]
    })
    .join('')
}
