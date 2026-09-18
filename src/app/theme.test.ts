import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, loadTheme, saveTheme } from './theme.ts'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts dark and remembers the chosen theme', () => {
    expect(loadTheme()).toBe('dark')

    saveTheme('light')
    expect(loadTheme()).toBe('light')

    saveTheme('dark')
    expect(loadTheme()).toBe('dark')
  })

  it('marks the page with the current theme', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
