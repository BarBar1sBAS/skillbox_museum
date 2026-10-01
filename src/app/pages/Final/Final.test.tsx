import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '@/app/routes.tsx'
import { loadAnswers, resetProgress, saveAnswer } from '@/app/scenes/index.ts'
import { shareResult } from './share.ts'

vi.mock('./share.ts', () => ({ shareResult: vi.fn() }))

function renderFinal() {
  const router = createMemoryRouter(routes, { initialEntries: ['/final'] })
  return render(<RouterProvider router={router} />)
}

function answerBlock(scenes: readonly number[], outcome: 'correct' | 'partial') {
  for (const n of scenes) saveAnswer(n as 1, outcome)
}

describe('Final', () => {
  beforeEach(() => {
    resetProgress()
    vi.mocked(shareResult).mockReset().mockResolvedValue('')
  })

  afterEach(() => {
    cleanup()
  })

  it('не показывает промокод, если ключ не собран', () => {
    renderFinal()
    expect(screen.getByText('КЛЮЧИ НЕ СОБРАНЫ')).toBeInTheDocument()
    expect(screen.queryByText(/ОТКРЫТА СКИДКА/)).not.toBeInTheDocument()
  })

  it('даёт 5% за один ключ и 10% за все три', () => {
    answerBlock([1, 2, 3], 'correct')
    renderFinal()
    expect(screen.getByText('ПОЛУЧЕН НОВЫЙ КЛЮЧ')).toBeInTheDocument()
    expect(screen.getByText('ОТКРЫТА СКИДКА 5%')).toBeInTheDocument()
    cleanup()

    answerBlock([4, 5, 6], 'correct')
    renderFinal()
    expect(screen.getByText('ПОЛУЧЕН ВТОРОЙ КЛЮЧ')).toBeInTheDocument()
    expect(screen.getByText('ОТКРЫТА СКИДКА 7%')).toBeInTheDocument()
    cleanup()

    answerBlock([7, 8, 9, 10], 'correct')
    renderFinal()
    expect(screen.getByText('ВСЕ КЛЮЧИ СОБРАНЫ')).toBeInTheDocument()
    expect(screen.getByText('ОТКРЫТА СКИДКА 10%')).toBeInTheDocument()
  })

  it('сбрасывает прогресс по ПОВТОРИТЬ', async () => {
    answerBlock([1, 2, 3], 'correct')
    const user = userEvent.setup()
    renderFinal()
    await user.click(screen.getByRole('button', { name: /ПОВТОРИТЬ/ }))
    expect(loadAnswers()).toEqual({})
  })

  it('публикует результат и показывает статус', async () => {
    answerBlock([1, 2, 3], 'correct')
    vi.mocked(shareResult).mockResolvedValueOnce(
      'Публикация передана в выбранное приложение.',
    )
    const user = userEvent.setup()
    renderFinal()

    await user.click(
      screen.getByRole('button', { name: 'ПОДЕЛИТЬСЯ С ДРУЗЬЯМИ' }),
    )

    expect(shareResult).toHaveBeenCalledWith({ score: 30, keyCount: 1 })
    expect(screen.getByRole('status')).toHaveTextContent(
      'Публикация передана в выбранное приложение.',
    )
  })

  it('показывает ошибку генерации карточки', async () => {
    vi.mocked(shareResult).mockRejectedValueOnce(new Error('canvas'))
    const user = userEvent.setup()
    renderFinal()

    await user.click(
      screen.getByRole('button', { name: 'ПОДЕЛИТЬСЯ С ДРУЗЬЯМИ' }),
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Не удалось подготовить карточку.',
    )
  })
})
