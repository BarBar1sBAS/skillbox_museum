import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatHeader } from './ChatHeader.tsx'

const meta = {
  title: 'UIkit/ChatHeader',
  component: ChatHeader,
  tags: ['autodocs'],
  args: { name: 'Друг', status: 'в сети' },
} satisfies Meta<typeof ChatHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
