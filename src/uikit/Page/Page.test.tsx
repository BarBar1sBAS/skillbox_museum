import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Page } from './Page.tsx'

describe('Page', () => {
  it('renders children in a main landmark', () => {
    render(<Page>экран</Page>)
    expect(screen.getByRole('main')).toHaveTextContent('экран')
  })
})
