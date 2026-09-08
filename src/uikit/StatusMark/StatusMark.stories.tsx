import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { StatusMark } from './StatusMark.tsx'

const meta = {
  title: 'UIkit/StatusMark',
  component: StatusMark,
  tags: ['autodocs'],
  args: { tone: 'lime' },
} satisfies Meta<typeof StatusMark>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Orange: Story = {
  args: { tone: 'orange' },
}

export const Red: Story = {
  args: { tone: 'red' },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <StatusMark tone="lime" />
      <StatusMark tone="orange" />
      <StatusMark tone="red" />
    </Stack>
  ),
}
