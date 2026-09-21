import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { ScoreRing } from './ScoreRing.tsx'

const meta = {
  title: 'UIkit/ScoreRing',
  component: ScoreRing,
  tags: ['autodocs'],
  args: { value: 82 },
} satisfies Meta<typeof ScoreRing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Zero: Story = {
  args: { value: 0 },
}

export const Full: Story = {
  args: { value: 100 },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <ScoreRing value={0} />
      <ScoreRing value={82} />
      <ScoreRing value={100} />
    </Stack>
  ),
}
