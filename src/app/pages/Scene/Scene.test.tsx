import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'
import { loadAnswers, resetProgress, saveAnswer, scenes, totalScore } from '@/app/scenes/index.ts'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

async function openScene1(user: ReturnType<typeof userEvent.setup>) {
  renderPath('/scene/1')
  await user.click(screen.getByRole('button', { name: 'ВЗЯТЬ ТЕЛЕФОН' }))
}

describe('Scene steps', () => {
  beforeEach(() => {
    resetProgress()
  })

  afterEach(() => {
    cleanup()
  })

  it('opens scene 1 on the intro and goes to the chat quiz', async () => {
    const user = userEvent.setup()
    renderPath('/scene/1')
    expect(screen.getByText('начало цифрового дня')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ВЗЯТЬ ТЕЛЕФОН' }))
    expect(screen.getByText('Друг')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('opens scene 2 on the photo intro CTA', () => {
    renderPath('/scene/2')
    expect(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' })).toBeInTheDocument()
  })

  it('does not show the key modal before the block is finished', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    expect(screen.queryByText('ПОЛУЧЕН')).not.toBeInTheDocument()
  })

  it('shows the trust key after scene 3 when scenes 1–3 are correct', async () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    const user = userEvent.setup()
    renderPath('/scene/3')
    await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText(/КЛЮЧ “ДОВЕРИЕ”/)).toBeInTheDocument()
    expect(screen.getByText('ПОЛУЧЕН')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.queryByText('1/3')).not.toBeInTheDocument()
  })

  it('does not show the key when one scene of the block is not correct', async () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'partial')
    const user = userEvent.setup()
    renderPath('/scene/3')
    await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    expect(screen.queryByText('ПОЛУЧЕН')).not.toBeInTheDocument()
  })

  it('saves points for the confirmed answer', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(loadAnswers()).toEqual({ 1: 'partial' })
    expect(totalScore()).toBe(4)
  })

  it('goes to /result after the last scene', async () => {
    const user = userEvent.setup()
    renderPath('/scene/10')
    await user.click(screen.getByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    await user.click(screen.getByRole('button', { name: 'УЗНАТЬ РЕЗУЛЬТАТ' }))
    expect(screen.getByText('Твой результат')).toBeInTheDocument()
  })

  it('sends an unknown scene to the rules', () => {
    renderPath('/scene/99')
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('goes back to rules from the chat header', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('shows a wrong-result screen and continues to the next scene', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[2])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('НЕВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ПРОДОЛЖИТЬ' }))
    expect(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' })).toBeInTheDocument()
  })

  it('starts on the quiz when the scene has no intro', () => {
    const intro = scenes[10].intro
    scenes[10].intro = undefined
    try {
      renderPath('/scene/10')
      expect(screen.getByText('Как ты поступишь?')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' })).not.toBeInTheDocument()
    } finally {
      scenes[10].intro = intro
    }
  })

  it('does not save if confirm is pressed with no choice', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(loadAnswers()).toEqual({})
  })

  it('retries a missing scene image and follows the desktop query', async () => {
    const listeners = new Set<() => void>()
    const media = {
      matches: true,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }
    window.matchMedia = () => media as unknown as MediaQueryList

    const user = userEvent.setup()
    renderPath('/scene/2')
    const img = document.querySelector('img[src*="scenes"]') as HTMLImageElement
    fireEvent.error(img)
    expect(img.getAttribute('src')).toContain('02-intro')

    await user.click(screen.getByRole('switch', { name: 'Светлая тема' }))
    media.matches = false
    listeners.forEach((fn) => fn())
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
