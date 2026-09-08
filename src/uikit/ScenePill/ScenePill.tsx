import { Text } from '../Text/Text.tsx'
import styles from './ScenePill.module.scss'

export type SceneNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type ScenePillProps = {
  n: SceneNumber
  onClick?: () => void
}

export function ScenePill({ n, onClick }: ScenePillProps) {
  return (
    <button type="button" className={styles.pill} onClick={onClick}>
      <Text as="span" variant="bodyM" color="primary">
        сцена {n}
      </Text>
    </button>
  )
}
