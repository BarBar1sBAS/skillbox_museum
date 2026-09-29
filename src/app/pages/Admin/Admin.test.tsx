import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { routes } from '@/app/routes.tsx'
import type { Summary } from '../../../../server/summary.ts'
import { Admin } from './Admin.tsx'

const summary: Summary = {
  started: 1314,
  completed: 1116,
  completionRate: 83,
  avgIndex: 68.7,
  avgTimeSec: 5 * 60 + 54,
  byDay: [
    { label: '01.09', count: 150 },
    { label: '02.09', count: 120 },
    { label: '03.09', count: 130 },
    { label: '04.09', count: 110 },
    { label: '05.09', count: 135 },
    { label: '06.09', count: 170 },
    { label: '07.09', count: 140 },
  ],
  topErrors: [
    { label: 'Просьба о переводе', percent: 81 },
    { label: 'Публичный Wi-Fi', percent: 70 },
    { label: 'Неизвестная ссылка', percent: 64 },
    { label: 'Разрешения приложений', percent: 58 },
  ],
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Admin', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    document.documentElement.dataset.theme = 'light'
  })

  it('показывает панель при верном ключе', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(Response.json(summary))))
    const user = userEvent.setup()
    renderAt('/secret')
    expect(await screen.findByRole('heading', { name: 'Статистика прохождений' })).toBeInTheDocument()
    expect(screen.getByText('1 116')).toBeInTheDocument()
    expect(screen.getByText('из 1 314')).toBeInTheDocument()
    expect(screen.getByText('1 116 завершивших')).toBeInTheDocument()
    expect(screen.getByText('83%')).toBeInTheDocument()
    expect(screen.getByText('68,7')).toBeInTheDocument()
    expect(screen.getByText('5:54')).toBeInTheDocument()
    expect(screen.getByText('из 100')).toBeInTheDocument()
    expect(screen.getByText('170')).toBeInTheDocument()
    expect(screen.getByText('01.09')).toBeInTheDocument()
    expect(screen.getByText('Просьба о переводе')).toBeInTheDocument()
    expect(screen.getByText('81%')).toBeInTheDocument()
    expect(screen.getByText('58%')).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Светлая тема' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('согласует причастие с 1 и 11', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ ...summary, started: 1, completed: 1 }))),
    )
    renderAt('/one')
    expect(await screen.findByText('1 завершивший')).toBeInTheDocument()
    cleanup()
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ ...summary, started: 11, completed: 11 }))),
    )
    renderAt('/eleven')
    expect(await screen.findByText('11 завершивших')).toBeInTheDocument()
  })

  it('при неверном ключе отправляет на главную', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))))
    renderAt('/nope')
    expect(await screen.findByRole('button', { name: 'КАК ИГРАТЬ' })).toBeInTheDocument()
  })

  it('игнорирует поздний ответ после ухода со страницы', async () => {
    let resolve!: (value: Response) => void
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((done) => {
            resolve = done
          }),
      ),
    )
    const view = renderAt('/secret')
    expect(screen.queryByRole('heading', { name: 'Статистика прохождений' })).not.toBeInTheDocument()
    view.unmount()
    await act(async () => {
      resolve(Response.json(summary))
      await new Promise((done) => setTimeout(done, 0))
    })
    expect(screen.queryByRole('heading', { name: 'Статистика прохождений' })).not.toBeInTheDocument()
  })

  it('игнорирует поздний отказ после ухода со страницы', async () => {
    let reject!: (reason: Error) => void
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((_done, fail) => {
            reject = fail
          }),
      ),
    )
    const view = renderAt('/secret')
    view.unmount()
    await act(async () => {
      reject(new Error('offline'))
      await new Promise((done) => setTimeout(done, 0))
    })
    expect(screen.queryByRole('button', { name: 'КАК ИГРАТЬ' })).not.toBeInTheDocument()
  })

  it('перенаправляет, если в маршруте нет ключа', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const router = createMemoryRouter(
      [
        { path: '/', element: <p>home</p> },
        { path: '/no-key', Component: Admin },
      ],
      { initialEntries: ['/no-key'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText('home')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
