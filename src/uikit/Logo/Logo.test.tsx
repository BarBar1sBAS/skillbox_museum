import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo.tsx'

describe('Logo', () => {
  it('показывает все три строки названия музея', () => {
    render(<Logo />)
    expect(screen.getByText('МУЗЕЙ')).toBeInTheDocument()
    expect(screen.getByText('КРИПТО')).toBeInTheDocument()
    expect(screen.getByText('ГРАФИИ')).toBeInTheDocument()
  })
})
