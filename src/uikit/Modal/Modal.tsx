import { useEffect, useRef, type ReactNode } from 'react'
import styles from './Modal.module.scss'

type ModalProps = {
  children: ReactNode
  onClose: () => void
  closeButton?: boolean
  className?: string
}

export function Modal({
  children,
  onClose,
  closeButton = false,
  className,
}: ModalProps) {
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const root = dialog.current!
    const focusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]',
        ),
      )
    ;(focusable()[0] ?? root).focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const items = focusable()
        const first = items[0],
          last = items.at(-1)
        if (!first) {
          event.preventDefault()
          root.focus()
        } else if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === root)
        ) {
          event.preventDefault()
          last!.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className={[styles.overlay, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={styles.backdrop}
        tabIndex={-1}
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        ref={dialog}
        tabIndex={-1}
        aria-label="Информация об игре"
        role="dialog"
        aria-modal="true"
        className={styles.dialog}
      >
        {closeButton ? (
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        ) : null}
        {children}
      </div>
    </div>
  )
}
