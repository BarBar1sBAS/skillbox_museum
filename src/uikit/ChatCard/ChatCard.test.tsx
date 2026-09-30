import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatCard } from './ChatCard.tsx'

describe('ChatCard', () => {
  it('показывает последнюю строку, когда reveal равен 3', () => {
    render(<ChatCard reveal={3} />)
    expect(
      screen.getByText('Узнай больше на выставке Музея криптографии.'),
    ).toBeInTheDocument()
  })

  it('держит поздние строки зашифрованными, пока их не откроют', () => {
    render(<ChatCard reveal={1} />)
    expect(
      screen.getByText('Каждый день ты оставляешь цифровой след.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Но технологий не нужно бояться — их нужно понимать.'),
    ).not.toBeInTheDocument()
  })
})
