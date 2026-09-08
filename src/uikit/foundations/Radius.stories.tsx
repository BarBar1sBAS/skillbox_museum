import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text/Text.tsx'
import { RADII } from '../tokens.ts'

const meta = {
  title: 'Foundations/Radius',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'calc(var(--spacing-20) * 1px)',
      }}
    >
      {RADII.map((name) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '6.875rem',
              height: '5.6875rem',
              background: 'var(--color-cyan)',
              borderRadius: `calc(var(--radius-${name}) * 1px)`,
            }}
          />
          <Text variant="bodyS" style={{ marginTop: 8 }}>
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
}
