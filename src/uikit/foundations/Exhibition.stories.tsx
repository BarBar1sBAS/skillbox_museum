import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button,
  ChatCard,
  ChoiceCard,
  TrustChip,
  KeyModal,
  PromoCode,
  PixelScene,
  Text,
} from '../index'
function Exhibition() {
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <div style={{ maxWidth: 900, padding: 24, display: 'grid', gap: 32 }}>
      <Text as="h1" variant="h1">
        Ключ к доверию / UI kit
      </Text>
      <Text variant="bodyM">
        Выставка «На грани доверия». Halvar, музейная палитра и состояния игры.
      </Text>
      <div style={{ display: 'flex', gap: 12 }}>
        <TrustChip label="ДОВЕРИЕ" active />
        <TrustChip label="ДАННЫЕ" />
        <TrustChip label="ДОСТУП" />
      </div>
      <Button arrow>Основное действие</Button>
      <Button variant="outline">Вторичное действие</Button>
      <Button disabled>Выбери ответ</Button>
      <fieldset style={{ border: 0, padding: 0, display: 'grid', gap: 12 }}>
        <legend>Один ответ, клавиатура и длинный текст</legend>
        {[
          'Позвоню другу и проверю просьбу другим способом связи.',
          'Перед публикацией обрежу лишнее, скрою чек, пропуск и карту, спрошу друга про фото и подумаю, нужна ли геометка.',
        ].map((text, i) => (
          <ChoiceCard
            key={text}
            name="storybook-choice"
            selected={picked === i}
            onClick={() => setPicked(i)}
          >
            {text}
          </ChoiceCard>
        ))}
      </fieldset>
      <ChatCard />
      <ChatCard reveal={1} />
      <ChatCard reveal={2} />
      <ChatCard reveal={3} />
      <PixelScene
        src="/images/pixel/03-quiz.webp"
        alt="Кофе и QR-код"
        priority
      />
      <PixelScene
        src="/missing-story-image.png"
        alt="Описание сцены доступно при ошибке загрузки"
      />
      <KeyModal keyName="ДОВЕРИЕ" step={1} />
      <PromoCode percent={5} code="CRYPTO5" />
    </div>
  )
}
const meta = {
  title: 'Museum/Exhibition UI kit',
  component: Exhibition,
} satisfies Meta<typeof Exhibition>
export default meta
type Story = StoryObj<typeof meta>
export const Light: Story = { globals: { theme: 'light' } }
export const Dark: Story = { globals: { theme: 'dark' } }
export const FocusedChoice: Story = {
  render: () => (
    <ChoiceCard name="focus-example">
      Позвоню другу по телефону и проверю просьбу.
    </ChoiceCard>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('input')?.focus()
  },
}
