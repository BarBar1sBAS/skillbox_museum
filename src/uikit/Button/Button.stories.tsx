import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { Button } from './Button.tsx'

const meta = {
  title: 'UIkit/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'НАЧАТЬ ДЕНЬ', arrow: true },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: { children: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ', arrow: false, variant: 'outline' },
}

export const Small: Story = {
  args: {
    children: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ',
    arrow: false,
    size: 's',
    variant: 'outline',
  },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <Button arrow>НАЧАТЬ ДЕНЬ</Button>
      <Button>БЕЗ СТРЕЛКИ</Button>
      <Button size="l" arrow>Начать игру</Button>
      <Button variant="outline">ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ</Button>
      <Button size="s" variant="outline">ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ</Button>
    </Stack>
  ),
}

