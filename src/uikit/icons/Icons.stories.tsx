import type { Meta, StoryObj } from '@storybook/react-vite'
import copy from './copy.svg'
import key from './key.svg'

const meta = {
  title: 'UIkit/Icons',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <img
        src={key}
        alt="ключ"
        width={30}
        height={16}
        style={{ transform: 'rotate(-45deg)' }}
      />
      <img src={copy} alt="копировать" width={19} height={19} />
    </div>
  ),
}
