import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text/Text.tsx'
import { PALETTE } from '../tokens.ts'

const meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Swatches: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 12.8125rem)',
        gap: 'calc(var(--spacing-20) * 1px)',
      }}
    >
      {PALETTE.map((name) => (
        <div key={name}>
          <div
            style={{
              height: '5.6875rem',
              borderRadius: 'calc(var(--radius-l) * 1px)',
              background: `var(--color-${name})`,
              border:
                name === 'white' || name === 'navy-deep'
                  ? '1px solid color-mix(in srgb, var(--color-white) 20%, transparent)'
                  : undefined,
            }}
          />
          <Text variant="bodyS" style={{ marginTop: 8 }}>
            {name} · {`var(--color-${name})`}
          </Text>
        </div>
      ))}
    </div>
  ),
}
