import { mkdirSync } from 'node:fs'
import { timingSafeEqual } from 'node:crypto'
import { dirname, join } from 'node:path'
import { Database } from 'bun:sqlite'
import { limited, sameHost, summarize, type Outcome, type Run } from './summary.ts'

type Row = {
  id: string
  started_at: number
  completed_at: number | null
  score: number | null
  answers: string
}

const hits = new Map<string, number[]>()
let db: Database | undefined

function database() {
  if (db) return db
  const file = process.env.STATS_DB ?? join(process.cwd(), 'data', 'stats.sqlite')
  mkdirSync(dirname(file), { recursive: true })
  db = new Database(file)
  db.exec(`CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    score REAL,
    answers TEXT NOT NULL
  )`)
  return db
}

function keyOk(given: string) {
  const expected = process.env.ADMIN_KEY ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  if (a.length === 0 || a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function runs(): Run[] {
  return database()
    .query<Row>('SELECT id, started_at, completed_at, score, answers FROM runs')
    .all()
    .map((row) => ({
      startedAt: row.started_at,
      completedAt: row.completed_at,
      score: row.score,
      answers: JSON.parse(row.answers) as Run['answers'],
    }))
}

function outcomeOf(value: unknown): Outcome | null {
  if (value === 'correct' || value === 'partial' || value === 'wrong') return value
  return null
}

export async function handleApi(req: Request, ip: string, now = Date.now()) {
  const url = new URL(req.url)
  const host = url.host

  if (req.method === 'GET') {
    const stats = url.pathname.match(/^\/api\/stats\/([^/]+)$/)
    if (!stats) return Response.json({ error: 'missing' }, { status: 404 })
    const key = decodeURIComponent(stats[1] ?? '')
    if (!keyOk(key)) return new Response(null, { status: 404 })
    return Response.json(summarize(runs(), now))
  }

  if (!sameHost(req.headers.get('origin'), req.headers.get('referer'), host)) {
    return new Response(null, { status: 403 })
  }

  if (req.method === 'POST' && url.pathname === '/api/runs') {
    if (limited(hits, ip, now)) return new Response(null, { status: 429 })
    const id = crypto.randomUUID()
    database().query('INSERT INTO runs (id, started_at, answers) VALUES (?, ?, ?)').run(id, now, '{}')
    return Response.json({ id }, { status: 201 })
  }

  const patch = url.pathname.match(/^\/api\/runs\/([^/]+)$/)
  if (req.method !== 'PATCH' || !patch) return new Response(null, { status: 404 })

  const id = decodeURIComponent(patch[1] ?? '')
  const row = database().query<Row>('SELECT id, started_at, completed_at, score, answers FROM runs WHERE id = ?').get(id)
  if (!row) return new Response(null, { status: 404 })

  let body: { scene?: unknown; outcome?: unknown; complete?: unknown; score?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return new Response(null, { status: 400 })
  }

  const scene = body.scene
  const outcome = outcomeOf(body.outcome)
  const hasAnswer = scene != null || body.outcome != null
  if (hasAnswer) {
    if (!Number.isInteger(scene) || (scene as number) < 1 || (scene as number) > 10 || !outcome) {
      return new Response(null, { status: 400 })
    }
    let answers: Record<string, Outcome> = {}
    try {
      answers = JSON.parse(row.answers) as Record<string, Outcome>
    } catch {
      answers = {}
    }
    answers[String(scene)] = outcome
    database().query('UPDATE runs SET answers = ? WHERE id = ?').run(JSON.stringify(answers), id)
  }

  if (body.complete === true) {
    if (typeof body.score !== 'number' || !Number.isFinite(body.score)) {
      return new Response(null, { status: 400 })
    }
    const score = Math.min(100, Math.max(0, Math.round(body.score)))
    if (row.completed_at == null) {
      database()
        .query('UPDATE runs SET completed_at = ?, score = ? WHERE id = ? AND completed_at IS NULL')
        .run(now, score, id)
    }
  } else if (!hasAnswer) {
    return new Response(null, { status: 400 })
  }

  return Response.json({ ok: true })
}
