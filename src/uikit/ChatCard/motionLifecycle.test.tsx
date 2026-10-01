import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useDecoded, useTick } from './cipherMotion'
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
it('заканчивает расшифровку до 900ms и очищает таймер', () => {
  vi.useFakeTimers()
  const view = renderHook(() => useDecoded(100))
  for (let i = 0; i < 25; i++)
    act(() => {
      vi.advanceTimersByTime(35)
    })
  expect(view.result.current).toBe(100)
  expect(vi.getTimerCount()).toBe(0)
  view.unmount()
})
it('не оставляет бесконечного перебора и очищает таймер при уходе', () => {
  vi.useFakeTimers()
  const view = renderHook(() => useTick(140))
  act(() => {
    vi.advanceTimersByTime(1000)
  })
  expect(vi.getTimerCount()).toBe(0)
  view.unmount()
  const another = renderHook(() => useDecoded(100))
  another.unmount()
  expect(vi.getTimerCount()).toBe(0)
})
it('при reduced motion сразу открывает строку', () => {
  vi.useFakeTimers()
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const view = renderHook(() => useDecoded(80))
  expect(view.result.current).toBe(80)
  expect(vi.getTimerCount()).toBe(0)
})
it('не запускает повторную расшифровку восстановленного фрагмента', () => {
  vi.useFakeTimers()
  const view = renderHook(() => useDecoded(80, false))
  expect(view.result.current).toBe(80)
  expect(vi.getTimerCount()).toBe(0)
  view.rerender()
  expect(view.result.current).toBe(80)
})
it('не перебирает символы шифра при reduced motion', () => {
  vi.useFakeTimers()
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const view = renderHook(() => useTick(140))
  expect(view.result.current).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})
