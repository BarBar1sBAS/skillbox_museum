import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatHeader } from './ChatHeader.tsx'

describe('ChatHeader', () => {
  it('показывает имя собеседника', () => {
    render(<ChatHeader name="Друг" status="в сети" />)
    expect(screen.getByText('Друг')).toBeInTheDocument()
  })

  it('вызывает onBack', async () => {
    const onBack = vi.fn()
    render(<ChatHeader name="Друг" status="в сети" onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: 'Назад' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
