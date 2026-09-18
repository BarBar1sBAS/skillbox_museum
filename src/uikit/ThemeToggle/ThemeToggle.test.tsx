import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle.tsx'

describe('ThemeToggle', () => {
  it('reports the opposite theme on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ThemeToggle theme="dark" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: 'Светлая тема' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(onChange).toHaveBeenCalledWith('light')
  })
})
