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

  it('keeps later lines ciphered until they are revealed', () => {
    render(<ChatCard reveal={1} />)
    expect(
      screen.getByText('Каждый день ты оставляешь цифровой след'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Но технологий не нужно бояться - их нужно понимать.'),
    ).not.toBeInTheDocument()
  })
})
