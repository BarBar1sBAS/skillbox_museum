import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text/Text.tsx'
import { SPACINGS } from '../tokens.ts'
import { Stack } from './Stack.tsx'

const meta = {
  title: 'UIkit/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: { gap: 20 },
  argTypes: {
    gap: { control: 'select', options: [...SPACINGS] },
  },
  render: (args) => (
    <Stack {...args}>
      <Text as="h1" variant="h1">
        Музей
      </Text>
      <Text color="muted" variant="bodyM">
        Каркас готов. Токены из Figma.
      </Text>
    </Stack>
  ),
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tight: Story = {
  args: { gap: 10 },
}
