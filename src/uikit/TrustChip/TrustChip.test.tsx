import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrustChip } from './TrustChip.tsx'

describe('TrustChip', () => {
  it('renders ДОВЕРИЕ as a pressed button when active', () => {
    render(<TrustChip active />)
    expect(screen.getByRole('button', { name: 'ДОВЕРИЕ' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
