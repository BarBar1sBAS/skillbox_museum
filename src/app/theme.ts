import { useEffect, useState } from 'react'
import type { Theme } from '@/uikit/index.ts'

const STORAGE_KEY = 'theme'

// по умолчанию тема светлая, тёмная — только если её выбрали переключателем
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
    applyTheme(theme)
  }, [theme])

  return [
    theme,
    (next: Theme) => {
      saveTheme(next)
      setTheme(next)
    },
  ]
}
