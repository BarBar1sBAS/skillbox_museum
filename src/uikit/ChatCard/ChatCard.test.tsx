import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatCard } from './ChatCard.tsx'

describe('ChatCard', () => {
  it('shows the last line when reveal is 3', () => {
    render(<ChatCard reveal={3} />)
    expect(
      screen.getByText('Узнай больше на выставке Музея криптографии'),
    ).toBeInTheDocument()
  })
})
