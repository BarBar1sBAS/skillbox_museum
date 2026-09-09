import { Text } from '../Text/Text.tsx'
import styles from './Logo.module.scss'

export function Logo() {
  return (
    <div className={styles.logo}>
      <Text as="span" variant="logo">
        МУЗЕЙ
      </Text>
      <Text as="span" variant="logo">
        КРИПТО
      </Text>
      <Text as="span" variant="logo">
        ГРАФИИ
      </Text>
    </div>
  )
}
