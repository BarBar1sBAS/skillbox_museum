import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App.tsx'
import { applyTheme, loadTheme } from './app/theme.ts'
import './styles/index.scss'

// тему ставим до первой отрисовки, чтобы страница не мигала другой темой
applyTheme(loadTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
