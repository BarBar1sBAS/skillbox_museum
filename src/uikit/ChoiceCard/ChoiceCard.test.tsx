import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChoiceCard } from './ChoiceCard.tsx'

const SAMPLE =
  'Напишу ему в том же чате и проверю, что это именно он просит перевести деньги.'

describe('ChoiceCard', () => {
  it('показывает выбранный вариант как отмеченную радиокнопку', () => {
    render(<ChoiceCard selected>{SAMPLE}</ChoiceCard>)
    expect(screen.getByRole('radio', { name: SAMPLE })).toBeChecked()
  })

  it('сообщает родителю о выборе', async () => {
    const onClick = vi.fn()
    render(<ChoiceCard onClick={onClick}>{SAMPLE}</ChoiceCard>)
    await userEvent.click(screen.getByRole('radio', { name: SAMPLE }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
