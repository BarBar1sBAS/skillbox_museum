import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo.tsx'

const meta = {
  title: 'UIkit/Logo',
  component: Logo,
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
