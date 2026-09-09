import { Text } from '../Text/Text.tsx'
import styles from './ScenePill.module.scss'

export type SceneNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type ScenePillProps = {
  n?: SceneNumber
  label?: string
  onClick?: () => void
}

export function ScenePill({ n, label, onClick }: ScenePillProps) {
  return (
    <button
      type="button"
      className={[styles.pill, label && styles.plain].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <Text as="span" variant="bodyM" color="primary">
        {label ?? `сцена ${n}`}
      </Text>
    </button>
  )
}
