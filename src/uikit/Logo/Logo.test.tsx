import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo.tsx'

describe('Logo', () => {
  it('ведёт на сайт музея в новой вкладке', () => {
    render(<Logo />)
    const link = screen.getByRole('link', { name: 'Музей криптографии' })
    expect(link).toHaveAttribute('href', 'https://cryptography-museum.ru/')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
