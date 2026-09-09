import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatBubble } from './ChatBubble.tsx'

describe('ChatBubble', () => {
  it('renders message and time', () => {
    render(<ChatBubble time="08:00">По этому номеру 8808080808</ChatBubble>)
    expect(screen.getByText('По этому номеру 8808080808')).toBeInTheDocument()
    expect(screen.getByText('08:00')).toBeInTheDocument()
  })
})
