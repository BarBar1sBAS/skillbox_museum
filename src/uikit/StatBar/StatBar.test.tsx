import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatBar } from './StatBar.tsx'

describe('StatBar', () => {
  it('shows label, score and clamped progress', () => {
    const { rerender } = render(<StatBar label="Доверие" value={100} />)
    const bar = screen.getByRole('progressbar', { name: 'Доверие' })
    expect(screen.getByText('Доверие')).toBeInTheDocument()
    expect(screen.getByText('100/100')).toBeInTheDocument()
    expect(bar).toHaveAttribute('aria-valuenow', '100')

    rerender(<StatBar label="Доступ" value={160} />)
    expect(screen.getByRole('progressbar', { name: 'Доступ' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )

    rerender(<StatBar label="Данные" value={-8} />)
    expect(screen.getByRole('progressbar', { name: 'Данные' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
  })
})
