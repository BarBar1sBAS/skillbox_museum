import { Button, Logo, SceneCount, Stack, Text } from '@/uikit/index.ts'
import styles from './Rules.module.scss'

const STEPS = [
  {
    n: '01',
    title: 'Прочитай ситуацию',
    text: 'Представь себя на месте героя и подумай, как бы ты поступил.',
  },
  {
    n: '02',
    title: 'Выбери один из трех вариантов',
    text: 'Нажми на подходящий ответ. До подтверждения выбор можно изменить.',
  },
  {
    n: '03',
    title: 'Нажми «Подтвердить выбор»',
    text: 'Прочитай объяснение своего решения, затем переходи к следующей ситуации.',
  },
]

const KEY_RULES = [
  'За каждую пройденную ситуацию ты получаешь фрагмент ключа из ее категории.',
  'Пройдешь все ситуации категории — соберешь целый ключ.',
  'Фрагмент ключа дается за правильный ответ и за частично правильный.',
]

export function Rules() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <SceneCount />
      </header>

      <Stack gap={20}>
        <Text as="h1" variant="h1">
          Правила игры
        </Text>

        <Text variant="bodyMBold" className={styles.body}>
          Тебя ждут 10 ситуаций из повседневной цифровой жизни. В каждой — 3
          варианта действий.
        </Text>

        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.step}>
              <Text
                as="span"
                variant="h3"
                color="accent"
                style={{ fontSize: '0.875rem' }}
              >
                {step.n}
              </Text>
              <div className={styles.stepBody}>
                <Text as="span" variant="bodyL">
                  {step.title}
                </Text>
                <Text variant="bodyM" className={styles.body}>
                  {step.text}
                </Text>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.keysCard}>
          <Text variant="bodyL">Как получить ключи</Text>
          {KEY_RULES.map((rule) => (
            <Text key={rule} variant="bodyM" className={styles.body}>
              {rule}
            </Text>
          ))}
        </div>
      </Stack>

      <div className={styles.cta}>
        <Button arrow>НАЧАТЬ</Button>
      </div>
    </main>
  )
}
