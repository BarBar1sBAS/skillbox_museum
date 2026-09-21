import { useEffect, type ReactNode } from 'react'
import styles from './Modal.module.scss'

type ModalProps = {
  children: ReactNode
  onClose: () => void
  closeButton?: boolean
  className?: string
}

export function Modal({ children, onClose, closeButton = false, className }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={[styles.overlay, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть"
        onClick={onClose}
      />
      {/* ponytail: no focus trap / no body-scroll lock; upgrade with a dialog primitive if needed */}
      <div role="dialog" aria-modal="true" className={styles.dialog}>
        {closeButton ? (
          <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        ) : null}
        {children}
      </div>
    </div>
  )
}
