import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChoiceCard } from './ChoiceCard.tsx'

const SAMPLE =
  'Напишу ему в том же чате и проверю, что это именно он просит перевести деньги.'

describe('ChoiceCard', () => {
  it('renders selected as a checked radio', () => {
    render(<ChoiceCard selected>{SAMPLE}</ChoiceCard>)
    expect(screen.getByRole('radio', { name: SAMPLE })).toBeChecked()
  })

  it('notifies the parent when chosen', async () => {
    const onClick = vi.fn()
    render(<ChoiceCard onClick={onClick}>{SAMPLE}</ChoiceCard>)
    await userEvent.click(screen.getByRole('radio', { name: SAMPLE }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
