import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'
import { resetProgress, saveAnswer } from '@/app/scenes/index.ts'

function renderResult() {
  const router = createMemoryRouter(routes, { initialEntries: ['/result'] })
  return render(<RouterProvider router={router} />)
}

describe('Result', () => {
  beforeEach(() => {
    resetProgress()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows 82 and 7 of 10 after mixed answers', () => {
    for (const n of [1, 2, 3, 4, 5, 7, 8] as const) saveAnswer(n, 'correct')
    for (const n of [6, 9, 10] as const) saveAnswer(n, 'partial')
    renderResult()
    expect(screen.getByText('82')).toBeInTheDocument()
    expect(screen.getByText(/7 из 10/)).toBeInTheDocument()
    expect(screen.getByText('безопасных решений')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'УЗНАТЬ О ВЫСТАВКЕ' })).toBeInTheDocument()
    expect(screen.getByText('БАСТИОН')).toBeInTheDocument()
  })

  it('opens details with key bars and insight, then closes', async () => {
    for (const n of [1, 2, 3, 4, 5, 7, 8] as const) saveAnswer(n, 'correct')
    for (const n of [6, 9, 10] as const) saveAnswer(n, 'partial')
    const user = userEvent.setup()
    renderResult()

    await user.click(screen.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' }))
    expect(screen.getByText('Доверие')).toBeInTheDocument()
    expect(screen.getByText('100/100')).toBeInTheDocument()
    expect(screen.getByText('Ты умеешь распознавать обман')).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Закрыть' })[1])
    expect(screen.queryByText('Доверие')).not.toBeInTheDocument()
  })

  it('hides the insight card when there is no progress', async () => {
    const user = userEvent.setup()
    renderResult()
    expect(screen.getByText('0')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' }))
    expect(screen.queryByText('Твоя сильная сторона')).not.toBeInTheDocument()
  })

  it('goes to the cipher screen', async () => {
    const user = userEvent.setup()
    renderResult()
    await user.click(screen.getByRole('button', { name: 'ПЕРЕЙТИ К ШИФРУ' }))
    expect(screen.getByRole('button', { name: 'ПОВТОРИТЬ' })).toBeInTheDocument()
  })
})
