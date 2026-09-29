import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Stack } from './Stack.tsx'

describe('Stack', () => {
  it('рендерит детей с токеном промежутка', () => {
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

  it('по умолчанию ставит промежуток 20', () => {
    const { container } = render(
      <Stack>
        <span>а</span>
      </Stack>,
    )
    expect(container.firstChild).toHaveStyle({
      gap: 'calc(var(--spacing-20) * 1px)',
    })
  })
})
