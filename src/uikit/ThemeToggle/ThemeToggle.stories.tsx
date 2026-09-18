import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

const meta = {
  title: 'UIkit/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Dark: Story = {}

export const Light: Story = {
  args: { theme: 'light' },
}

export const Both: Story = {
  render: () => (
    <Stack gap={20}>
      <ThemeToggle />
      <ThemeToggle theme="light" />
    </Stack>
  ),
}
