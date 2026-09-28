const RUN_KEY = 'runId'

export function loadRunId() {
  try {
    return sessionStorage.getItem(RUN_KEY)
  } catch {
    return null
  }
}

export function clearRunId() {
  try {
    sessionStorage.removeItem(RUN_KEY)
  } catch {
    return
  }
}

let starting = false

export function startRun() {
  if (starting || loadRunId()) return
  starting = true
  return work().finally(() => {
    starting = false
  })
}

async function work() {
  try {
    const res = await fetch('/api/runs', { method: 'POST' })
    if (!res.ok) return
    const body = (await res.json()) as { id?: unknown }
    if (typeof body.id !== 'string') return
    try {
      sessionStorage.setItem(RUN_KEY, body.id)
    } catch {
      return
    }
  } catch {
    return
  }
}

function send(id: string, body: unknown) {
  return fetch(`/api/runs/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => undefined)
}

export function reportAnswer(scene: number, outcome: string) {
  const id = loadRunId()
  if (!id) return
  return send(id, { scene, outcome })
}

export function completeRun(score: number) {
  const id = loadRunId()
  if (!id) return
  return send(id, { complete: true, score })
}
