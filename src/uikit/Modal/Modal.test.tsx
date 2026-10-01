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

it('удерживает фокус внутри диалога и возвращает его на триггер', async () => {
  const user = userEvent.setup()
  const trigger = document.createElement('button')
  document.body.append(trigger)
  trigger.focus()
  const view = render(
    <Modal onClose={() => {}}>
      <button>Первый</button>
      <button>Последний</button>
    </Modal>,
  )
  expect(screen.getByRole('button', { name: 'Первый' })).toHaveFocus()
  await user.tab({ shift: true })
  expect(screen.getByRole('button', { name: 'Последний' })).toHaveFocus()
  await user.tab()
  expect(screen.getByRole('button', { name: 'Первый' })).toHaveFocus()
  view.unmount()
  expect(trigger).toHaveFocus()
  trigger.remove()
})
it('держит фокус на диалоге без интерактивных элементов', async () => {
  const user = userEvent.setup()
  render(<Modal onClose={() => {}}>Текст</Modal>)
  await user.tab()
  expect(screen.getByRole('dialog')).toHaveFocus()
})
it('поддерживает прямой обход и Shift+Tab с контейнера диалога', async () => {
  const user = userEvent.setup()
  render(
    <Modal onClose={() => {}}>
      <button>Один</button>
      <button>Два</button>
      <button>Три</button>
    </Modal>,
  )
  await user.tab()
  expect(screen.getByRole('button', { name: 'Два' })).toHaveFocus()
  await user.tab({ shift: true })
  expect(screen.getByRole('button', { name: 'Один' })).toHaveFocus()
  screen.getByRole('dialog').focus()
  await user.tab({ shift: true })
  expect(screen.getByRole('button', { name: 'Три' })).toHaveFocus()
})
