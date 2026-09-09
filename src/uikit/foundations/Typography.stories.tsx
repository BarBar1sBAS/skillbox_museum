import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text/Text.tsx'
import { TEXT_VARIANTS, type TextVariant } from '../tokens.ts'

const samples: Record<TextVariant, string> = {
  h1: 'МУЗЕЙ ПРИСЛАЛ ТЕБЕ',
  h2: 'ТЫ РАСПОЗНАЛ УГРОЗУ',
  h3: 'НАЧАТЬ ДЕНЬ',
  h3Bold: 'НАЧАТЬ ДЕНЬ',
  cta: 'Начать игру',
  h4: 'РЕЗУЛЬТАТ',
  eyebrow: 'интерактивная игра',
  subtitle: 'о цифровой безопасности',
  kicker: 'Один день',
  fineprint: 'КЛЮЧ К ДОВЕРИЮ',
  bodyL: 'Нажми “Подтвердить выбор”',
  bodyM: 'Пройди 10 ситуаций цифрового дня.',
  bodyMBold: 'Музей криптографии',
  bodyS: 'Музей криптографии',
  logo: 'МУЗЕЙ КРИПТОГРАФИИ',
  cipher: '0101^0110001”;1001”00@1!1001**10',
}

const meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'calc(var(--spacing-20) * 1px)',
      }}
    >
      {TEXT_VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{
            display: 'grid',
            gridTemplateColumns: '7rem 1fr',
            gap: 'calc(var(--spacing-20) * 1px)',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyS" color="muted">
            {variant}
          </Text>
          <Text
            variant={variant}
            color={variant === 'h4' ? 'muted' : 'primary'}
          >
            {samples[variant]}
          </Text>
        </div>
      ))}
    </div>
  ),
}
