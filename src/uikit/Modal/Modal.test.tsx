import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal.tsx'

describe('Modal', () => {
  afterEach(() => {
    cleanup()
  })

  it('закрывается по клику на фон и по Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal className="extra" onClose={onClose}>
        <p>содержимое</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('содержимое')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Закрыть' })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    await user.keyboard('a')
    expect(onClose).toHaveBeenCalledTimes(1)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('показывает кнопку закрытия, которая тоже вызывает onClose', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal closeButton onClose={onClose}>
        <p>содержимое</p>
      </Modal>,
    )

    const buttons = screen.getAllByRole('button', { name: 'Закрыть' })
    expect(buttons).toHaveLength(2)
    await user.click(buttons[1])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
