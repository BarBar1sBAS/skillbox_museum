import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MUSEUM_URL } from '../museum.ts'
import { ChatCard } from './ChatCard.tsx'

describe('ChatCard', () => {
  it('показывает последнюю строку со ссылкой на музей, когда reveal равен 3', () => {
    render(<ChatCard reveal={3} />)
    expect(screen.getByText(/Узнай больше на выставке/)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Музея криптографии' })
    expect(link).toHaveAttribute('href', MUSEUM_URL)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('держит поздние строки зашифрованными, пока их не откроют', () => {
    render(<ChatCard reveal={1} />)
    expect(
      screen.getByText('Каждый день ты оставляешь цифровой след.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Но технологий не нужно бояться — их нужно понимать.'),
    ).not.toBeInTheDocument()
  })
})

it('раскрывает только новый фрагмент и сохраняет уже открытый при следующем ключе', () => {
 vi.useFakeTimers()
 const first = 'Каждый день ты оставляешь цифровой след.'
 const second = 'Но технологий не нужно бояться — их нужно понимать.'
 const view = render(<ChatCard reveal={1} animateStep={1} />)
 try {
  for (let i = 0; i < 26; i++) act(() => { vi.advanceTimersByTime(35) })
  expect(screen.getByText(first).textContent).toBe(first)
  view.rerender(<ChatCard reveal={2} animateStep={2} />)
  expect(screen.getByText(first).textContent).toBe(first)
  const secondLine = screen.getByText(second).closest('p')!
  expect(secondLine.querySelector('[aria-hidden]')?.textContent).not.toBe(second)
  for (let i = 0; i < 26; i++) act(() => { vi.advanceTimersByTime(35) })
  expect(screen.getByText(second).textContent).toBe(second)
  expect(vi.getTimerCount()).toBe(0)
 } finally { view.unmount(); vi.useRealTimers() }
})

it('сохраняет доступную ссылку во время расшифровки и после неё', () => {
  vi.useFakeTimers()
  const view = render(<ChatCard reveal={3} animateStep={3} />)
  try {
    const link = screen.getByRole('link', { name: 'Музея криптографии' })
    expect(link).toHaveAttribute('href', MUSEUM_URL)
    expect(link.querySelector('[aria-hidden]')?.textContent).not.toBe('Музея криптографии')
    for (let i = 0; i < 26; i++) act(() => { vi.advanceTimersByTime(35) })
    expect(screen.getByRole('link', { name: 'Музея криптографии' })).toBe(link)
    expect(link.textContent).toBe('Музея криптографии')
    expect(link.querySelector('[aria-hidden]')).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    view.unmount()
    vi.useRealTimers()
  }
})
