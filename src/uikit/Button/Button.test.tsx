import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button.tsx'

describe('Button', () => {
  it('вызывает onClick при нажатии', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>НАЧАТЬ ДЕНЬ</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'НАЧАТЬ ДЕНЬ' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('показывает контурный вариант и всё равно вызывает onClick', async () => {
    const onClick = vi.fn()
    render(
      <Button variant="outline" onClick={onClick}>
        ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' })
    expect(button.className).toMatch(/outline/)
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('показывает большую кнопку со стрелкой', () => {
    render(
      <Button size="l" arrow>
        Начать игру
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Начать игру' }).className).toMatch(/large/)
  })

  it('показывает малый размер и всё равно вызывает onClick', async () => {
    const onClick = vi.fn()
    render(
      <Button size="s" variant="outline" onClick={onClick}>
        ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' })
    expect(button.className).toMatch(/small/)
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
