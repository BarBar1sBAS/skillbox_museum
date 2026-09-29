import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Start', () => {
  afterEach(() => {
    cleanup()
  })

  it('переходит к правилам с КАК ИГРАТЬ', async () => {
    const user = userEvent.setup()
    renderPath('/start')
    await user.click(screen.getByRole('button', { name: 'КАК ИГРАТЬ' }))
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })
})
