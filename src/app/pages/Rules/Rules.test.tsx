import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Rules', () => {
  afterEach(() => {
    cleanup()
  })

  it('запускает сцену 1 с НАЧАТЬ', async () => {
    const user = userEvent.setup()
    renderPath('/rules')
    await user.click(screen.getByRole('button', { name: 'НАЧАТЬ' }))
    expect(screen.getByText('начало цифрового дня')).toBeInTheDocument()
  })
})
