import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PromoCode } from './PromoCode.tsx'

describe('PromoCode', () => {
  it('показывает скидку и копирует код по клику', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<PromoCode percent={5} code="CRYPTO5" />)
    expect(screen.getByText('ОТКРЫТА СКИДКА 5%')).toBeInTheDocument()
    expect(screen.getByText('CRYPTO5')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Скопировать CRYPTO5' }))
    expect(writeText).toHaveBeenCalledWith('CRYPTO5')
  })
})
