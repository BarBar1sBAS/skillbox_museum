import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { routes } from '@/app/routes.tsx'
import {
  loadAnswers,
  resetProgress,
  saveAnswer,
  scenes,
  totalScore,
} from '@/app/scenes/index.ts'

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

async function openScene1(user: ReturnType<typeof userEvent.setup>) {
  renderPath('/scene/1')
  await user.click(screen.getByRole('button', { name: 'ВЗЯТЬ ТЕЛЕФОН' }))
}

describe('Шаги сцены', () => {
  beforeEach(() => {
    resetProgress()
  })

  afterEach(() => {
    cleanup()
  })

  it('открывает сцену 1 на вступлении и переходит к чат-викторине', async () => {
    const user = userEvent.setup()
    renderPath('/scene/1')
    expect(screen.getByText('начало цифрового дня')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ВЗЯТЬ ТЕЛЕФОН' }))
    expect(screen.getByText('Друг')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('открывает сцену 2 на кнопке фото-вступления', () => {
    renderPath('/scene/2')
    expect(
      screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' }),
    ).toBeInTheDocument()
  })

  it('не показывает модалку ключа, пока блок не закончен', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    expect(screen.queryByText('ПОЛУЧЕН')).not.toBeInTheDocument()
  })

  it('показывает ключ доверия после сцены 3, если сцены 1–3 верные', async () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'correct')
    const user = userEvent.setup()
    renderPath('/scene/3')
    await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(screen.getByText(/КЛЮЧ “ДОВЕРИЕ”/)).toBeInTheDocument()
    expect(screen.getByText('ПОЛУЧЕН')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Закрыть',
      }),
    )
    expect(screen.queryByText('1/3')).not.toBeInTheDocument()
  })

  it('не показывает ключ, если одна сцена блока неверная', async () => {
    saveAnswer(1, 'correct')
    saveAnswer(2, 'partial')
    const user = userEvent.setup()
    renderPath('/scene/3')
    await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    expect(screen.queryByText('ПОЛУЧЕН')).not.toBeInTheDocument()
  })

  it('сохраняет очки за подтверждённый ответ', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(loadAnswers()).toEqual({ 1: 'partial' })
    expect(totalScore()).toBe(4)
  })

  it('после последней сцены переходит на /result', async () => {
    const user = userEvent.setup()
    renderPath('/scene/10')
    await user.click(screen.getByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' }))
    await user.click(screen.getAllByRole('radio')[1])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    await user.click(screen.getByRole('button', { name: 'УЗНАТЬ РЕЗУЛЬТАТ' }))
    expect(screen.getByText('Твой результат')).toBeInTheDocument()
  })

  it('неизвестную сцену отправляет на правила', () => {
    renderPath('/scene/99')
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('возвращается к правилам из шапки чата', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByText('Правила игры')).toBeInTheDocument()
  })

  it('показывает экран неверного ответа и переходит к следующей сцене', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(screen.getAllByRole('radio')[2])
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(screen.getByText('НЕВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'ПРОДОЛЖИТЬ' }))
    expect(
      screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' }),
    ).toBeInTheDocument()
  })

  it('начинает с викторины, если у сцены нет вступления', () => {
    const intro = scenes[10].intro
    scenes[10].intro = undefined
    try {
      renderPath('/scene/10')
      expect(screen.getByText('Как ты поступишь?')).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' }),
      ).not.toBeInTheDocument()
    } finally {
      scenes[10].intro = intro
    }
  })

  it('не сохраняет, если подтвердить без выбора', async () => {
    const user = userEvent.setup()
    await openScene1(user)
    await user.click(
      screen.getAllByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' })[0],
    )
    expect(loadAnswers()).toEqual({})
  })
})

it('восстанавливает выбор и подтверждённый результат после обновления', async () => {
  resetProgress()
  const user = userEvent.setup()
  await openScene1(user)
  await user.click(screen.getAllByRole('radio')[1])
  cleanup()
  renderPath('/scene/1')
  expect(screen.getAllByRole('radio')[1]).toBeChecked()
  await user.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }))
  cleanup()
  renderPath('/scene/1')
  expect(screen.getByText('ВЕРНОЕ РЕШЕНИЕ')).toBeInTheDocument()
  expect(totalScore()).toBe(10)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

describe('все 30 исходов десяти сцен', () => {
  beforeEach(() => resetProgress())
  afterEach(() => cleanup())
  for (const scene of Object.values(scenes)) {
    for (const [index, choice] of scene.choices.entries()) {
      it(`сцена ${scene.n}: ${choice.outcome}`, async () => {
        const user = userEvent.setup()
        renderPath(`/scene/${scene.n}`)
        if (scene.intro)
          await user.click(
            screen.getByRole('button', { name: scene.intro.cta }),
          )
        await user.click(screen.getAllByRole('radio')[index])
        await user.click(
          screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }),
        )
        expect(loadAnswers()[scene.n]).toBe(choice.outcome)
        expect(totalScore()).toBe(
          { correct: 10, partial: 4, wrong: 0 }[choice.outcome],
        )
        expect(
          screen.getByText(
            {
              correct: 'ВЕРНОЕ РЕШЕНИЕ',
              partial: 'НЕ СОВСЕМ ПРАВИЛЬНО',
              wrong: 'НЕВЕРНОЕ РЕШЕНИЕ',
            }[choice.outcome],
          ),
        ).toBeInTheDocument()
      })
    }
  }
})
it('не начисляет ключ повторно, если подтверждение уже попало в хранилище', async () => {
  resetProgress()
  saveAnswer(1, 'correct')
  saveAnswer(2, 'correct')
  const user = userEvent.setup()
  renderPath('/scene/3')
  await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
  await user.click(screen.getAllByRole('radio')[1])
  saveAnswer(3, 'correct')
  await user.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(totalScore()).toBe(30)
})
it('показывает памятку без двоеточия и восстанавливается после неполного сохранения', async () => {
  resetProgress()
  const previous = scenes[2].remember
  scenes[2].remember = 'Проверяй подключение'
  sessionStorage.setItem(
    'scene-session-v1',
    '{"2":{"step":"result","picked":2}}',
  )
  try {
    const user = userEvent.setup()
    renderPath('/scene/2')
    await user.click(screen.getByRole('button', { name: 'ЗАЙТИ В ВАГОН' }))
    await user.click(screen.getAllByRole('radio')[2])
    await user.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }))
    expect(screen.getByText('Проверяй подключение')).toBeInTheDocument()
  } finally {
    scenes[2].remember = previous
  }
})

it('закрывает награду клавишей Escape', async () => {
  resetProgress()
  saveAnswer(1, 'correct')
  saveAnswer(2, 'correct')
  const user = userEvent.setup()
  renderPath('/scene/3')
  await user.click(screen.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }))
  await user.click(screen.getAllByRole('radio')[1])
  await user.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
