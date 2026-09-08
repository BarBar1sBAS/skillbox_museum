import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { KeyModal } from './KeyModal.tsx'

const meta = {
  title: 'UIkit/KeyModal',
  component: KeyModal,
  tags: ['autodocs'],
} satisfies Meta<typeof KeyModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Two: Story = {
  args: { step: 2 },
}

export const Three: Story = {
  args: { step: 3 },
}

export const All: Story = {
  render: () => (
    <Stack gap={20}>
      <KeyModal />
      <KeyModal step={2} />
      <KeyModal step={3} />
    </Stack>
  ),
}
