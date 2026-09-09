import type { Meta, StoryObj } from '@storybook/react-vite'
import { VoiceBubble } from './VoiceBubble.tsx'

const meta = {
  title: 'UIkit/VoiceBubble',
  component: VoiceBubble,
  tags: ['autodocs'],
  args: {
    duration: '00:05',
    time: '08:00',
    children: 'Бро, привет, скинь 2000, пожалуйста, вечером верну.',
  },
} satisfies Meta<typeof VoiceBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
