import { useState } from 'react'
import styles from './PromoCode.module.scss'
export type PromoPercent = 5 | 7 | 10
export function PromoCode({
  percent,
  code,
}: {
  percent: PromoPercent
  code: string
}) {
  const [status, setStatus] = useState('')
  const [manual, setManual] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('Промокод скопирован')
      setManual(false)
    } catch {
      setStatus('Скопируй код вручную')
      setManual(true)
    }
  }
  return (
    <div className={styles.card}>
      <p className={styles.label}>ОТКРЫТА СКИДКА {percent}%</p>
      <button
        className={styles.code}
        type="button"
        aria-label={`Скопировать ${code}`}
        onClick={() => void copy()}
      >
        {code}
        <span className={styles.copyHint} aria-hidden>КОПИРОВАТЬ</span>
      </button>
      {status && <p role="status">{status}</p>}
      {manual && (
        <input
          aria-label="Промокод"
          readOnly
          value={code}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </div>
  )
}
