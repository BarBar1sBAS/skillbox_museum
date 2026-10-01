import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  afterEach(() => {
    cleanup()
  })

  it('открывает стартовый экран на корневом маршруте', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: 'КАК ИГРАТЬ' }),
    ).toBeInTheDocument()
  })
})
it('использует hash-маршруты в сборке GitHub Pages', async () => {
  const { vi } = await import('vitest')
  vi.stubEnv('VITE_GITHUB_PAGES', 'true')
  vi.resetModules()
  const { App: PagesApp } = await import('./App')
  try {
    render(<PagesApp />)
    expect(
      screen.getByRole('button', { name: 'КАК ИГРАТЬ' }),
    ).toBeInTheDocument()
  } finally {
    cleanup()
    vi.unstubAllEnvs()
  }
})
