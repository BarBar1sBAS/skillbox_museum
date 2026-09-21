import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyModal } from '../KeyModal/KeyModal.tsx'
import { Text } from '../Text/Text.tsx'
import { Modal } from './Modal.tsx'

const meta = {
  title: 'UIkit/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    onClose: () => undefined,
    children: (
      <div style={{ padding: '2rem', background: 'var(--background-modal)', borderRadius: 20 }}>
        <Text variant="h2">Содержимое</Text>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCloseButton: Story = {
  args: { closeButton: true },
}

export const WithKeyModal: Story = {
  args: {
    children: <KeyModal step={1} />,
  },
}
