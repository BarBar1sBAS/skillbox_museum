import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack.tsx'
import { PromoCode } from './PromoCode.tsx'

const meta = {
  title: 'UIkit/PromoCode',
  component: PromoCode,
  tags: ['autodocs'],
  args: {
    percent: 5,
    code: 'CRYPTO5',
  },
} satisfies Meta<typeof PromoCode>

export default meta
type Story = StoryObj<typeof meta>

export const Five: Story = {}

export const Seven: Story = {
  args: { percent: 7, code: 'CRYPTO7' },
}

export const Ten: Story = {
  args: { percent: 10, code: 'CRYPTO10' },
}

export const All: Story = {
  args: { percent: 5, code: 'CRYPTO5' },
  render: () => (
    <Stack gap={20}>
      <PromoCode percent={5} code="CRYPTO5" />
      <PromoCode percent={7} code="CRYPTO7" />
      <PromoCode percent={10} code="CRYPTO10" />
    </Stack>
  ),
}
