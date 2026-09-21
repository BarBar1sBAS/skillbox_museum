import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { StatBar } from './StatBar.tsx'

const meta = {
  title: 'UIkit/StatBar',
  component: StatBar,
  tags: ['autodocs'],
  args: { label: 'Доверие', value: 100 },
} satisfies Meta<typeof StatBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <StatBar label="Доверие" value={100} />
      <StatBar label="Доступ" value={60} />
      <StatBar label="Данные" value={85} />
    </Stack>
  ),
}
