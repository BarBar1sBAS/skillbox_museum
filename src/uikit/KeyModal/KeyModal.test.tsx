import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
})
