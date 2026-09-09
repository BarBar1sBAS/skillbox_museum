import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { TrustChip } from './TrustChip.tsx'

const meta = {
  title: 'UIkit/TrustChip',
  component: TrustChip,
  tags: ['autodocs'],
} satisfies Meta<typeof TrustChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  args: { active: true },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <TrustChip />
      <TrustChip label="ДАННЫЕ" />
      <TrustChip label="ДОСТУП" />
      <TrustChip active />
    </Stack>
  ),
}
