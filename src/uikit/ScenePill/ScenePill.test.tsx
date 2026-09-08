import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScenePill } from './ScenePill.tsx'

describe('ScenePill', () => {
  it('renders сцена 10 as a button', () => {
    render(<ScenePill n={10} />)
    expect(screen.getByRole('button', { name: 'сцена 10' })).toBeInTheDocument()
  })
})
