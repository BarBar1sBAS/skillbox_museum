import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { ChatBubble } from './ChatBubble.tsx'

const meta = {
  title: 'UIkit/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  args: { time: '08:00', children: 'По этому номеру 8808080808' },
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const All: Story = {
  render: () => (
    <Stack gap={10}>
      <ChatBubble time="08:00">По этому номеру 8808080808</ChatBubble>
      <ChatBubble time="08:01">Это новый, я поменял</ChatBubble>
    </Stack>
  ),
}
