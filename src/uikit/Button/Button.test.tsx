import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button.tsx'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>НАЧАТЬ ДЕНЬ</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'НАЧАТЬ ДЕНЬ' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
