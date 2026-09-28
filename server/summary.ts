export type Outcome = 'correct' | 'partial' | 'wrong'

export type Run = {
  startedAt: number
  completedAt: number | null
  score: number | null
  answers: Partial<Record<number, Outcome>>
}

export type DayPoint = { label: string; count: number }
export type ErrorPoint = { label: string; percent: number }

export type Summary = {
  started: number
  completed: number
  completionRate: number
  avgIndex: number
  avgTimeSec: number
  byDay: DayPoint[]
  topErrors: ErrorPoint[]
}

export const ERROR_LABEL: Record<number, string> = {
  1: 'Просьба о переводе',
  2: 'Публичный Wi-Fi',
  3: 'Неизвестная ссылка',
  4: 'Сохранение пароля',
  5: 'Разрешения приложений',
  6: 'Уведомление банка',
  7: 'Звонок поддержки',
  8: 'Лишние данные в кадре',
  9: 'Умная колонка',
  10: 'Чужой вход',
}

const SCENES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const HOUR = 60 * 60 * 1000
const LIMIT = 10

function dayStart(ts: number) {
  const date = new Date(ts)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function dayLabel(ts: number) {
  const date = new Date(ts)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

function isDone(run: Run): run is Run & { completedAt: number } {
  return run.completedAt != null
}

export function summarize(runs: Run[], now = Date.now()): Summary {
  const done = runs.filter(isDone)
  const started = runs.length
  const completed = done.length
  const completionRate = started ? Math.round((completed / started) * 100) : 0
  const avgIndex = completed
    ? Math.round((done.reduce((sum, run) => sum + (run.score ?? 0), 0) / completed) * 10) / 10
    : 0
  const avgTimeSec = completed
    ? Math.round(
        done.reduce((sum, run) => sum + (run.completedAt - run.startedAt), 0) / completed / 1000,
      )
    : 0

  const today = dayStart(now)
  const byDay: DayPoint[] = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const start = new Date(today)
    start.setDate(start.getDate() - offset)
    const from = start.getTime()
    const count = done.filter((run) => dayStart(run.completedAt) === from).length
    byDay.push({ label: dayLabel(from), count })
  }

  const topErrors = SCENES.map((scene) => {
    let answered = 0
    let wrong = 0
    for (const run of runs) {
      const outcome = run.answers[scene]
      if (!outcome) continue
      answered += 1
      if (outcome === 'wrong') wrong += 1
    }
    return {
      scene,
      label: ERROR_LABEL[scene] ?? '',
      percent: answered ? Math.round((wrong / answered) * 100) : 0,
    }
  })
    .sort((a, b) => b.percent - a.percent || a.scene - b.scene)
    .slice(0, 4)
    .map(({ label, percent }) => ({ label, percent }))

  return { started, completed, completionRate, avgIndex, avgTimeSec, byDay, topErrors }
}

export function sameHost(origin: string | null, referer: string | null, host: string | null) {
  const raw = origin || referer
  if (!raw || !host) return false
  try {
    return new URL(raw).host === host
  } catch {
    return false
  }
}

export function limited(hits: Map<string, number[]>, ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < HOUR)
  if (recent.length >= LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}
