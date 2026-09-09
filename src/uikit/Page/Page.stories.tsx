import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text/Text.tsx'
import { Page } from './Page.tsx'

const meta = {
  title: 'UIkit/Page',
  component: Page,
  tags: ['autodocs'],
  args: { tone: 'default', children: 'Музей' },
  argTypes: {
    tone: { control: 'select', options: ['landing', 'default', 'chat', 'result'] },
  },
  render: (args) => (
    <Page tone={args.tone}>
      <Text as="h1" variant="h1">
        Музей
      </Text>
    </Page>
  ),
} satisfies Meta<typeof Page>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Landing: Story = {
  args: { tone: 'landing' },
}
