import { Landing } from './pages/Landing/Landing.tsx'
import { Rules } from './pages/Rules/Rules.tsx'
import { Start } from './pages/Start/Start.tsx'

export const routes = [
  { path: '/', Component: Landing },
  { path: '/start', Component: Start },
  { path: '/rules', Component: Rules },
]
