import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScenePill, type SceneNumber } from './ScenePill.tsx'

const NUMBERS: SceneNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const meta = {
  title: 'UIkit/ScenePill',
  component: ScenePill,
  tags: ['autodocs'],
  args: { n: 1 },
} satisfies Meta<typeof ScenePill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Label: Story = {
  args: { n: undefined, label: '10 сцен' },
}

export const All: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'calc(var(--spacing-5) * 1px)',
      }}
    >
      {NUMBERS.map((n) => (
        <ScenePill key={n} n={n} />
      ))}
    </div>
  ),
}
