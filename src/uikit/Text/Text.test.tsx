import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Text } from './Text.tsx'

describe('Text', () => {
  it('renders children', () => {
    render(<Text>Музей</Text>)
    expect(screen.getByText('Музей')).toBeInTheDocument()
  })

  it('applies color and variant token vars', () => {
    render(
      <Text color="accent" variant="h1">
        Заголовок
      </Text>,
    )
    const el = screen.getByText('Заголовок')
    expect(el).toHaveStyle({
      color: 'var(--text-accent)',
      fontFamily: 'var(--font-h1-family)',
      fontSize: 'var(--font-h1-size)',
      fontWeight: 'var(--font-h1-weight)',
    })
  })
})
