import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MUSEUM_URL } from '../museum.ts'
import { ChatCard } from './ChatCard.tsx'

describe('ChatCard', () => {
  it('показывает последнюю строку со ссылкой на музей, когда reveal равен 3', () => {
    render(<ChatCard reveal={3} />)
    expect(screen.getByText('Узнай больше на выставке')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Музея криптографии' })
    expect(link).toHaveAttribute('href', MUSEUM_URL)
    expect(link).toHaveAttribute('target', '_blank')
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
