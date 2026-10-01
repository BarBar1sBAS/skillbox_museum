import { useEffect, useState } from 'react'
import type { Theme } from '@/uikit/index.ts'

const STORAGE_KEY = 'theme'
const THEME_CHANGE = 'museum:theme-change'

export function loadTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    return
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    const syncTheme = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail)
    }
    window.addEventListener(THEME_CHANGE, syncTheme)
    return () => window.removeEventListener(THEME_CHANGE, syncTheme)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return [
    theme,
    (next: Theme) => {
      saveTheme(next)
      setTheme(next)
      window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE, { detail: next }))
    },
  ]
}
