import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearRunId, completeRun, loadRunId, reportAnswer, startRun } from './track.ts'

function json(body: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }))
}

describe('track', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('stores a new run id and ignores a second start', async () => {
    let release!: (value: Response) => void
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          release = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const first = startRun()
    startRun()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    release(new Response(JSON.stringify({ id: 'run-1' }), { status: 201 }))
    await first
    expect(loadRunId()).toBe('run-1')

    await startRun()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not store an id when the post fails or the body has none', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json({}, 500)))
    await startRun()
    expect(loadRunId()).toBeNull()

    vi.stubGlobal('fetch', vi.fn(() => json({})))
    await startRun()
    expect(loadRunId()).toBeNull()

    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
    await startRun()
    expect(loadRunId()).toBeNull()
  })

  it('survives blocked storage', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadRunId()).toBeNull()
    getItem.mockRestore()

    vi.stubGlobal('fetch', vi.fn(() => json({ id: 'run-2' })))
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    await startRun()
    setItem.mockRestore()
    expect(loadRunId()).toBeNull()

    const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    clearRunId()
    removeItem.mockRestore()
  })

  it('patches the answer and the final score for the current run', async () => {
    const fetchMock = vi.fn((url: string) => json({ ok: true, url }))
    vi.stubGlobal('fetch', fetchMock)
    reportAnswer(1, 'wrong')
    completeRun(40)
    expect(fetchMock).not.toHaveBeenCalled()

    sessionStorage.setItem('runId', 'run-3')
    await reportAnswer(1, 'wrong')
    await completeRun(40)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/runs/run-3')

    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
    await reportAnswer(2, 'correct')
    await completeRun(80)
    clearRunId()
    expect(loadRunId()).toBeNull()
  })
})
