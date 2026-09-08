import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { ChatCard } from './ChatCard.tsx'

const meta = {
  title: 'UIkit/ChatCard',
  component: ChatCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Line1: Story = {
  args: { reveal: 1 },
}

export const Line2: Story = {
  args: { reveal: 2 },
}

export const Open: Story = {
  args: { reveal: 3 },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <ChatCard />
      <ChatCard reveal={1} />
      <ChatCard reveal={2} />
      <ChatCard reveal={3} />
    </Stack>
  ),
}
