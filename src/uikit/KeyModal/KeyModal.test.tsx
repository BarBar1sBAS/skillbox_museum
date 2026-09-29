import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { KeyModal } from './KeyModal.tsx'

describe('KeyModal', () => {
  it('показывает 3/3, когда шаг 3', () => {
    render(<KeyModal step={3} />)
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('по умолчанию ДАННЫЕ и 1/3', () => {
    render(<KeyModal />)
    expect(screen.getByText(/КЛЮЧ “ДАННЫЕ”/)).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('закрывается по крестику, если передан onClose', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<KeyModal onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
