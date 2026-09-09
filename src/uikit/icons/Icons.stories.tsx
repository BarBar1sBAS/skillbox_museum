import type { Meta, StoryObj } from '@storybook/react-vite'
import avatar from './avatar.svg'
import back from './back.svg'
import callMenu from './call-menu.svg'
import copy from './copy.svg'
import key from './key.svg'
import play from './play.svg'
import transcribe from './transcribe.svg'

const meta = {
  title: 'UIkit/Icons',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
      <img
        src={key}
        alt="ключ"
        width={30}
        height={16}
        style={{ transform: 'rotate(-45deg)' }}
      />
      <img src={copy} alt="копировать" width={19} height={19} />
      <img src={back} alt="назад" width={43} height={43} />
      <img src={avatar} alt="аватар" width={38} height={38} />
      <img src={callMenu} alt="звонок и меню" width={50} height={23} />
      <img src={play} alt="воспроизвести" width={48} height={48} />
      <img src={transcribe} alt="расшифровка" width={11} height={8} />
    </div>
  ),
}
