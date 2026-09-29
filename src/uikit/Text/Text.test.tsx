import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Text } from './Text.tsx'

describe('Text', () => {
  it('рендерит детей', () => {
    render(<Text>Музей</Text>)
    expect(screen.getByText('Музей')).toBeInTheDocument()
  })

  it('применяет переменные цвета и варианта', () => {
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

  it('приглушает cipher и fineprint и сохраняет свой стиль', () => {
    const { rerender } = render(
      <Text as="span" variant="cipher" className="extra" style={{ letterSpacing: '1px' }}>
        шифр
      </Text>,
    )
    const el = screen.getByText('шифр')
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveStyle({ opacity: '0.7', letterSpacing: '1px' })

    rerender(<Text variant="fineprint">мелочь</Text>)
    expect(screen.getByText('мелочь')).toHaveStyle({ opacity: '0.7' })
  })
})
