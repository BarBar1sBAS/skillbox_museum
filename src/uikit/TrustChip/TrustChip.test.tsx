import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrustChip } from './TrustChip.tsx'

describe('TrustChip', () => {
  it('показывает ДОВЕРИЕ, когда активен', () => {
    render(<TrustChip active />)
    expect(screen.getByText('ДОВЕРИЕ')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('показывает неактивную плашку со своей подписью', () => {
    render(<TrustChip label="ДАННЫЕ" />)
    expect(screen.getByText('ДАННЫЕ')).toBeInTheDocument()
  })
})
