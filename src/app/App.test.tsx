import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

describe('App', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the landing route', () => {
    render(<App />)
    expect(screen.getByText('Начать игру')).toBeInTheDocument()
  })
})
