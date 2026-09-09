import { useNavigate } from 'react-router'
import { Button, Logo, Stack, Text } from '@/uikit/index.ts'
import arrowRightWhite from '@/uikit/icons/arrow-right-white.svg'
import museum from '@/uikit/icons/museum.svg'
import styles from './Landing.module.scss'

export function Landing() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <Stack gap={14}>
        <header className={styles.header}>
          <Logo />
          <div className={styles.intro}>
            <Text
              variant="h4"
              color="accent"
              style={{ fontSize: '0.75rem', fontWeight: 300, lineHeight: 1.25 }}
            >
              интерактивная игра
            </Text>
            <Text as="h1" variant="bodyL">
              о цифровой безопасности
            </Text>
          </div>
        </header>

        <div className={styles.heroBlock}>
          <img
            className={styles.hero}
            src="/images/hero.png"
            srcSet="/images/hero.png 1x, /images/hero@2x.png 2x"
            width={390}
            height={482}
            alt="Подросток с ноутбуком в окружении замков, паролей и сообщений"
          />

          <Text
            className={styles.days}
            variant="bodyL"
            style={{ fontWeight: 500 }}
          >
            Один день
            <span className={styles.count}>10</span>
            ситуаций
          </Text>
        </div>

        <Text className={styles.question} variant="bodyM" color="accent">
          Сможешь сохранить свою цифровую безопасность?
        </Text>

        <Button size="l" arrow onClick={() => navigate('/start')}>
          Начать игру
        </Button>

        <div className={styles.meta}>
          <Text variant="bodyS" color="muted">
            5-7 минут
          </Text>
          <Text variant="bodyS" color="muted">
            без регистрации
          </Text>
        </div>
      </Stack>

      <div className={styles.bannerWrap}>
        <div className={styles.banner}>
          <img src={museum} alt="" width={27} height={25} />
          <div className={styles.bannerText}>
            <Text variant="bodyS">ЧАСТЬ ВЫСТАВКИ</Text>
            <Text
              className={styles.bannerQuote}
              variant="h4"
              style={{ fontSize: '0.5rem', lineHeight: 1.25, opacity: 0.7 }}
            >
              “КЛЮЧ К ДОВЕРИЮ БЕЗОПАСНОСТЬ В ЭПОХУ ВЫСОКИХ ТЕХНОЛОГИЙ”
            </Text>
          </div>
          <span className={styles.bannerLink}>
            <Text as="span" variant="bodyS">
              О ВЫСТАВКЕ
            </Text>
            <img src={arrowRightWhite} alt="" width={15} height={8} />
          </span>
        </div>
      </div>
    </main>
  )
}
