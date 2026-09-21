import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScenePill } from './ScenePill.tsx'

describe('ScenePill', () => {
  it('renders сцена 10 as a button', () => {
    render(<ScenePill n={10} />)
    expect(screen.getByRole('button', { name: 'сцена 10' })).toBeInTheDocument()
  })

  it('renders a custom label', () => {
    render(<ScenePill label="10 сцен" />)
    expect(screen.getByRole('button', { name: '10 сцен' })).toBeInTheDocument()
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(<ScenePill n={1} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'сцена 1' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
