import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  afterEach(() => {
    cleanup()
  })

  it('opens the start screen on the root route', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'КАК ИГРАТЬ' })).toBeInTheDocument()
  })
})
