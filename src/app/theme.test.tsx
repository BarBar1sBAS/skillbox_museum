import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, loadTheme, saveTheme, useTheme } from './theme.ts'

function Probe() {
  const [theme, setTheme] = useTheme()
  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme}
    </button>
  )
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('начинает с тёмной и запоминает выбранную тему', () => {
    expect(loadTheme()).toBe('dark')

    saveTheme('light')
    expect(loadTheme()).toBe('light')

    saveTheme('dark')
    expect(loadTheme()).toBe('dark')
  })

  it('помечает страницу текущей темой', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('переживает сломанный localStorage и переключает тему через хук', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadTheme()).toBe('dark')
    getItem.mockRestore()

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    saveTheme('light')
    setItem.mockRestore()

    const user = userEvent.setup()
    render(<Probe />)
    expect(screen.getByText('dark')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('light')).toBeInTheDocument()
  })
})
