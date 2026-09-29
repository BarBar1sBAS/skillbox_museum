import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VoiceBubble } from './VoiceBubble.tsx'

describe('VoiceBubble', () => {
  it('показывает длительность', () => {
    render(
      <VoiceBubble duration="00:05" time="08:00">
        Бро, привет
      </VoiceBubble>,
    )
    expect(screen.getByText('00:05')).toBeInTheDocument()
  })
})
