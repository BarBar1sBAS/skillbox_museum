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

  it('начинает со светлой и запоминает выбранную тему', () => {
    expect(loadTheme()).toBe('light')

    saveTheme('dark')
    expect(loadTheme()).toBe('dark')

    saveTheme('light')
    expect(loadTheme()).toBe('light')
  })

  it('помечает страницу текущей темой', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('синхронизирует тему между переключателем и другими компонентами', async () => {
    const user = userEvent.setup()
    render(<><Probe /><Probe /></>)
    await user.click(screen.getAllByRole('button')[0])
    expect(screen.getAllByText('dark')).toHaveLength(2)
    expect(document.documentElement.dataset.theme).toBe('dark')
    await user.click(screen.getAllByRole('button')[1])
    expect(screen.getAllByText('light')).toHaveLength(2)
  })

  it('переживает сломанный localStorage и переключает тему через хук', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadTheme()).toBe('light')
    getItem.mockRestore()

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    saveTheme('dark')
    setItem.mockRestore()

    const user = userEvent.setup()
    render(<Probe />)
    expect(screen.getByText('light')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('dark')).toBeInTheDocument()
  })
})
