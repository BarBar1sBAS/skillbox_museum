import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChoiceCard } from './ChoiceCard.tsx'

const SAMPLE =
  'Напишу ему в том же чате и проверю, что это именно он просит перевести деньги.'

describe('ChoiceCard', () => {
  it('renders selected as a checked radio', () => {
    render(<ChoiceCard selected>{SAMPLE}</ChoiceCard>)
    expect(screen.getByRole('radio', { name: SAMPLE })).toBeChecked()
  })
})
