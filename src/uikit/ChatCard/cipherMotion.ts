import { useEffect, useState } from 'react'

const NOISE = '01▧▧▧'

function reducedMotion() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function noise(i: number, tick: number) {
  return (Math.imul(i + 1, 73856093) ^ Math.imul(tick + 1, 19349663)) >>> 0
}

export function useTick(ms: number) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reducedMotion()) return
    let elapsed = 0
    const id = setInterval(() => {
      elapsed += ms
      setTick((t) => t + 1)
      if (elapsed >= 700) clearInterval(id)
    }, ms)
    return () => clearInterval(id)
  }, [ms])

  return tick
}

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

export function useDecoded(length: number, animate = true) {
  const [shown, setShown] = useState(() =>
    !animate || reducedMotion() ? length : 0,
  )

  useEffect(() => {
    if (shown >= length) return
    const id = setTimeout(
      () => setShown((s) => Math.min(length, s + Math.ceil(length / 24))),
      35,
    )
    return () => clearTimeout(id)
  }, [shown, length])

  return shown
}

export function decodeFrame(text: string, shown: number) {
  return [...text]
    .map((c, i) => {
      if (i < shown || c === ' ') return c
      return NOISE[noise(i, shown) % NOISE.length]
    })
    .join('')
}
