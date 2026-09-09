import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Scene steps', () => {
  it('opens scene 1 on the chat quiz', () => {
    renderPath('/scene/1')
    expect(screen.getByText('Друг')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('opens scene 2 on the photo intro CTA', () => {
    renderPath('/scene/2')
    expect(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' })).toBeInTheDocument()
  })

  it('shows the key modal after a correct answer', async () => {
    const user = userEvent.setup()
    renderPath('/scene/1')
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0])
    expect(screen.getByText('ПОЛУЧЕН')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    await user.click(screen.getByText('ПОЛУЧЕН'))
    expect(screen.getByText('1/3')).toBeInTheDocument()
    fireEvent.click(screen.getByText('ПОЛУЧЕН').closest('[class*="keyOverlay"]')!)
    expect(screen.queryByText('1/3')).not.toBeInTheDocument()
  })
})
