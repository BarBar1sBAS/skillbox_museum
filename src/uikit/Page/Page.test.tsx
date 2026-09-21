import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Page } from './Page.tsx'

describe('Page', () => {
  it('renders children in a main landmark', () => {
    render(<Page>экран</Page>)
    expect(screen.getByRole('main')).toHaveTextContent('экран')
  })

  it('applies tone, className and data-scene', () => {
    const { rerender } = render(
      <Page tone="result" className="extra" data-scene={4}>
        результат
      </Page>,
    )
    expect(screen.getByRole('main').className).toMatch(/result/)

    rerender(<Page tone="landing">лендинг</Page>)
    expect(screen.getByRole('main').className).toMatch(/landing/)

    rerender(<Page tone="chat">чат</Page>)
    expect(screen.getByRole('main').className).toMatch(/chat/)
  })
})
