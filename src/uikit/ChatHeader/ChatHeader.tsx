import avatar from '../icons/avatar.svg'
import back from '../icons/back.svg'
import callMenu from '../icons/call-menu.svg'
import { Text } from '../Text/Text.tsx'
import styles from './ChatHeader.module.scss'

type ChatHeaderProps = {
  name: string
  status: string
  onBack?: () => void
}

export function ChatHeader({ name, status, onBack }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <button type="button" className={styles.back} aria-label="Назад" onClick={onBack}>
        <img src={back} alt="" width={43} height={43} />
      </button>
      <div className={styles.peer}>
        <img className={styles.avatar} src={avatar} alt="" width={38} height={38} />
        <div className={styles.meta}>
          <Text as="span" variant="bodyMBold">
            {name}
          </Text>
          <Text as="span" variant="bodyS" style={{ color: 'var(--color-violet)' }}>
            {status}
          </Text>
        </div>
      </div>
      <div className={styles.actions}>
        <img className={styles.call} src={callMenu} alt="" width={50} height={23} />
      </div>
    </header>
  )
}
