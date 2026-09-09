import type { Meta, StoryObj } from '@storybook/react-vite'
import { SceneCount } from './SceneCount.tsx'

const meta = {
  title: 'UIkit/SceneCount',
  component: SceneCount,
  tags: ['autodocs'],
} satisfies Meta<typeof SceneCount>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
