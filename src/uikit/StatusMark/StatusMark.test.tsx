import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusMark } from './StatusMark.tsx'

describe('StatusMark', () => {
  it('renders orange tone as внимание', () => {
    render(<StatusMark tone="orange" />)
    expect(screen.getByRole('img', { name: 'внимание' })).toBeInTheDocument()
  })
})
