import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrustChip } from './TrustChip.tsx'

describe('TrustChip', () => {
  it('renders ДОВЕРИЕ when active', () => {
    render(<TrustChip active />)
    expect(screen.getByText('ДОВЕРИЕ')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders an inactive chip with a custom label', () => {
    render(<TrustChip label="ДАННЫЕ" />)
    expect(screen.getByText('ДАННЫЕ')).toBeInTheDocument()
  })
})
