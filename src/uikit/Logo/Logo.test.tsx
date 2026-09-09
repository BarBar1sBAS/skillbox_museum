import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo.tsx'

describe('Logo', () => {
  it('renders all three lines of the museum name', () => {
    render(<Logo />)
    expect(screen.getByText('МУЗЕЙ')).toBeInTheDocument()
    expect(screen.getByText('КРИПТО')).toBeInTheDocument()
    expect(screen.getByText('ГРАФИИ')).toBeInTheDocument()
  })
})
