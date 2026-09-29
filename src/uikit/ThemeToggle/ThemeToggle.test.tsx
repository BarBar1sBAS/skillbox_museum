import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle.tsx'

describe('ThemeToggle', () => {
  it('по клику сообщает противоположную тему', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ThemeToggle theme="dark" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: 'Светлая тема' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(onChange).toHaveBeenCalledWith('light')
  })

  it('переключает светлую обратно в тёмную и игнорирует отсутствие onChange', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(<ThemeToggle theme="light" onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith('dark')

    rerender(<ThemeToggle theme="dark" />)
    await user.click(screen.getByRole('switch'))
  })
})
