import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusMark } from './StatusMark.tsx'

describe('StatusMark', () => {
  it('renders orange tone as внимание', () => {
    render(<StatusMark tone="orange" />)
    expect(screen.getByRole('img', { name: 'внимание' })).toBeInTheDocument()
  })

  it('показывает лаймовый и красный тона', () => {
    const { rerender } = render(<StatusMark tone="lime" />)
    expect(screen.getByRole('img', { name: 'успех' })).toBeInTheDocument()
    rerender(<StatusMark tone="red" />)
    expect(screen.getByRole('img', { name: 'ошибка' })).toBeInTheDocument()
  })
})
