import type { Meta, StoryObj } from '@storybook/react-vite'
import { TEXT_COLORS, TEXT_VARIANTS } from '../tokens.ts'
import { Text } from './Text.tsx'

const meta = {
  title: 'UIkit/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'Музей',
    color: 'primary',
    variant: 'bodyM',
  },
  argTypes: {
    color: { control: 'select', options: [...TEXT_COLORS] },
    variant: { control: 'select', options: [...TEXT_VARIANTS] },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Heading: Story = {
  args: { as: 'h1', variant: 'h1', children: 'МУЗЕЙ ПРИСЛАЛ ТЕБЕ' },
}
