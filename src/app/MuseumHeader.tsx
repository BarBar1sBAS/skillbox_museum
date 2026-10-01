import { MuseumHeader as MuseumHeaderView, type SceneNumber } from '@/uikit'
import { useTheme } from './theme'
export function MuseumHeader({ n }: { n?: SceneNumber }) {
  const [theme, setTheme] = useTheme()
  return <MuseumHeaderView n={n} theme={theme} onThemeChange={setTheme} />
}
