import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'
import { loadAnswers, resetProgress, saveAnswer } from '@/app/scenes/index.ts'

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
  })

  afterEach(() => {
    cleanup()
  })

  it('shows no promo code when no key is collected', () => {
    renderFinal()
    expect(screen.getByText('КЛЮЧИ НЕ СОБРАНЫ')).toBeInTheDocument()
    expect(screen.queryByText(/ОТКРЫТА СКИДКА/)).not.toBeInTheDocument()
  })

  it('gives 5% for one key and 10% for all three', () => {
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

  it('clears the progress on ПОВТОРИТЬ', async () => {
    answerBlock([1, 2, 3], 'correct')
    const user = userEvent.setup()
    renderFinal()
    await user.click(screen.getByRole('button', { name: /ПОВТОРИТЬ/ }))
    expect(loadAnswers()).toEqual({})
  })
})
