import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatHeader } from './ChatHeader.tsx'

describe('ChatHeader', () => {
  it('renders peer name', () => {
    render(<ChatHeader name="Друг" status="в сети" />)
    expect(screen.getByText('Друг')).toBeInTheDocument()
  })
})
