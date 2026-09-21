import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreRing } from './ScoreRing.tsx'

describe('ScoreRing', () => {
  it('shows the score out of 100 and clamps the value', () => {
    const { rerender } = render(<ScoreRing value={82} />)
    const ring = screen.getByRole('progressbar', { name: 'Индекс безопасности' })
    expect(screen.getByText('82')).toBeInTheDocument()
    expect(screen.getByText('из 100')).toBeInTheDocument()
    expect(ring).toHaveAttribute('aria-valuenow', '82')

    rerender(<ScoreRing value={140} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('100')).toBeInTheDocument()

    rerender(<ScoreRing value={-3} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
