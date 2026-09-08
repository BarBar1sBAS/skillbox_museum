import check from './check.svg'
import cross from './cross.svg'
import styles from './StatusMark.module.scss'

export type StatusTone = 'lime' | 'orange' | 'red'

const LABEL: Record<StatusTone, string> = {
  lime: 'успех',
  orange: 'внимание',
  red: 'ошибка',
}

type StatusMarkProps = {
  tone: StatusTone
}

export function StatusMark({ tone }: StatusMarkProps) {
  return (
    <div role="img" aria-label={LABEL[tone]} className={`${styles.mark} ${styles[tone]}`}>
      {tone === 'lime' ? (
        <img className={styles.check} src={check} alt="" width={31} height={37} />
      ) : tone === 'red' ? (
        <img className={styles.cross} src={cross} alt="" width={46} height={46} />
      ) : (
        <span className={styles.bang} aria-hidden>
          !
        </span>
      )}
    </div>
  )
}
