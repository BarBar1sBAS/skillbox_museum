import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { ChoiceCard } from './ChoiceCard.tsx'

const SAMPLE =
  'Напишу ему в том же чате и проверю, что это именно он просит перевести деньги.'

const meta = {
  title: 'UIkit/ChoiceCard',
  component: ChoiceCard,
  tags: ['autodocs'],
  args: { children: SAMPLE },
} satisfies Meta<typeof ChoiceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <ChoiceCard>{SAMPLE}</ChoiceCard>
      <ChoiceCard selected>{SAMPLE}</ChoiceCard>
    </Stack>
  ),
}
