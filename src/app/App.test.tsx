import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  afterEach(() => {
    cleanup()
  })

  it('открывает стартовый экран на корневом маршруте', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'КАК ИГРАТЬ' })).toBeInTheDocument()
  })
})
