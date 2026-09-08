import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Stack } from './Stack.tsx'

describe('Stack', () => {
  it('renders children with gap token', () => {
    const { container } = render(
      <Stack gap={25}>
        <span>а</span>
        <span>б</span>
      </Stack>,
    )
    expect(screen.getByText('а')).toBeInTheDocument()
    expect(screen.getByText('б')).toBeInTheDocument()
    expect(container.firstChild).toHaveStyle({
      gap: 'calc(var(--spacing-25) * 1px)',
    })
  })
})
