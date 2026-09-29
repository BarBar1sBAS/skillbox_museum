import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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

  it('открывает сцену 1 на вступлении и переходит к чат-викторине', async () => {
    const user = userEvent.setup()
    renderPath('/scene/1')
    expect(screen.getByText('начало цифрового дня')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ВЗЯТЬ ТЕЛЕФОН' }))
    expect(screen.getByText('Друг')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('открывает сцену 2 на кнопке фото-вступления', () => {
    renderPath('/scene/2')
    expect(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' })).toBeInTheDocument()
  })

  it('не показывает модалку ключа, пока блок не закончен', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    expect(screen.queryByText('ПОЛУЧЕН')).not.toBeInTheDocument()
  })

  it('показывает ключ доверия после сцены 3, если сцены 1–3 верные', async () => {
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
    // крестик внутри окна; вторая кнопка «Закрыть» — затемнённый фон вокруг
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Закрыть' }))
    expect(screen.queryByText('1/3')).not.toBeInTheDocument()
  })

  it('не показывает ключ, если одна сцена блока неверная', async () => {
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

  it('сохраняет очки за подтверждённый ответ', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(loadAnswers()).toEqual({ 1: 'partial' })
    expect(totalScore()).toBe(4)
  })

  it('после последней сцены переходит на /result', async () => {
    const user = userEvent.setup()
    renderPath('/scene/10')
    await user.click(screen.getByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    await user.click(screen.getByRole('button', { name: 'УЗНАТЬ РЕЗУЛЬТАТ' }))
    expect(screen.getByText('Твой результат')).toBeInTheDocument()
  })

  it('неизвестную сцену отправляет на правила', () => {
    renderPath('/scene/99')
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('возвращается к правилам из шапки чата', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('показывает экран неверного ответа и переходит к следующей сцене', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[2])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('НЕВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ПРОДОЛЖИТЬ' }))
    expect(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' })).toBeInTheDocument()
  })

  it('начинает с викторины, если у сцены нет вступления', () => {
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

  it('не сохраняет, если подтвердить без выбора', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(loadAnswers()).toEqual({})
  })

  it('перебирает отсутствующую картинку сцены и следит за десктопным запросом', async () => {
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
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
