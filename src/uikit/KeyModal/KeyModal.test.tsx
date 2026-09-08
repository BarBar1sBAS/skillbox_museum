import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KeyModal } from './KeyModal.tsx'

describe('KeyModal', () => {
  it('shows 3/3 when step is 3', () => {
    render(<KeyModal step={3} />)
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })
})
