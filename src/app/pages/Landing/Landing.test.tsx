import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Landing', () => {
  afterEach(() => {
    cleanup()
  })

  it('starts the game from the landing CTA', async () => {
    const user = userEvent.setup()
    renderPath('/')
    await user.click(screen.getByRole('button', { name: 'Начать игру' }))
    expect(screen.getByText(/ЗАШИФРОВАННОЕ СООБЩЕНИЕ/)).toBeInTheDocument()
  })
})
