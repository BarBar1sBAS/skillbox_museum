import { Stack, Text } from '@/uikit/index.ts'
import styles from './Home.module.scss'

export function Home() {
  return (
    <main className={styles.page}>
      <Stack gap={20}>
        <Text as="h1" variant="h1" color="primary">
          Музей
        </Text>
        <Text color="muted" variant="bodyM">
          Каркас готов. Токены из Figma.
        </Text>
      </Stack>
    </main>
  )
}
