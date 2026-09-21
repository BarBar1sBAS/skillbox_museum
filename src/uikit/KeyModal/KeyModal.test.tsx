import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KeyModal } from './KeyModal.tsx'

describe('KeyModal', () => {
  it('shows 3/3 when step is 3', () => {
    render(<KeyModal step={3} />)
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('defaults to ДАННЫЕ and 1/3', () => {
    render(<KeyModal />)
    expect(screen.getByText(/КЛЮЧ “ДАННЫЕ”/)).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })
})
