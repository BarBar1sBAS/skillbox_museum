import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import type { Summary } from '../../../../server/summary.ts'
import { useTheme } from '@/app/theme.ts'
import { Logo, Page, Text, ThemeToggle } from '@/uikit/index.ts'
import styles from './Admin.module.scss'

function grouped(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value).replace(/[\u00a0\u202f]/g, ' ')
}

function indexLabel(value: number) {
  return value.toFixed(1).replace('.', ',')
}

function finished(count: number) {
  const teen = count % 100 === 11
  const one = count % 10 === 1 && !teen
  return `${grouped(count)} ${one ? 'завершивший' : 'завершивших'}`
}

function clock(sec: number) {
  const whole = Math.max(0, Math.round(sec))
  const minutes = Math.floor(whole / 60)
  const seconds = whole % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function Admin() {
  const { key } = useParams()
  const [theme, setTheme] = useTheme()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!key) return
    let cancel = false
    fetch(`/api/stats/${encodeURIComponent(key)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('denied')
        return (await res.json()) as Summary
      })
      .then((data) => {
        if (!cancel) setSummary(data)
      })
      .catch(() => {
        if (!cancel) setDenied(true)
      })
    return () => {
      cancel = true
    }
  }, [key])

  if (!key || denied) return <Navigate to="/" replace />
  if (!summary) return null

  const max = Math.max(...summary.byDay.map((day) => day.count), 1)
  const cards: { label: string; value: string; note?: string }[] = [
    {
      label: 'Количество прохождений',
      value: grouped(summary.completed),
      note: `из ${grouped(summary.started)}`,
    },
    {
      label: 'Доля завершивших',
      value: `${summary.completionRate}%`,
      note: finished(summary.completed),
    },
    { label: 'Средний индекс', value: indexLabel(summary.avgIndex), note: 'из 100' },
    { label: 'Среднее время', value: clock(summary.avgTimeSec) },
  ]

  return (
    <Page className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>
      <Text as="h1" variant="h1" style={{ fontSize: 'var(--admin-title)', lineHeight: 1.05 }}>
        Статистика прохождений
      </Text>
      <div className={styles.grid}>
        {cards.map((card) => (
          <article key={card.label} className={styles.card}>
            <Text variant="bodyM" className={styles.label}>
              {card.label}
            </Text>
            <Text variant="h1">{card.value}</Text>
            {card.note ? (
              <Text variant="bodyS" color="muted">
                {card.note}
              </Text>
            ) : null}
          </article>
        ))}
      </div>
      <section className={styles.panel}>
        <Text as="h2" variant="h3Bold">
          Прохождения по дням
        </Text>
        <div className={styles.chart}>
          {summary.byDay.map((day) => (
            <div key={day.label} className={styles.col}>
              <Text as="span" variant="subtitle">
                {day.count}
              </Text>
              <div className={styles.track}>
                <div className={styles.bar} style={{ height: `${(day.count / max) * 100}%` }} />
              </div>
              <Text as="span" variant="bodyS" color="muted">
                {day.label}
              </Text>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.panel}>
        <Text as="h2" variant="h3Bold">
          Частые ошибки
        </Text>
        <ul className={styles.errors}>
          {summary.topErrors.map((row) => (
            <li key={row.label}>
              <Text as="span" variant="bodyM">
                {row.label}
              </Text>
              <Text as="span" variant="bodyM">
                {row.percent}%
              </Text>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
