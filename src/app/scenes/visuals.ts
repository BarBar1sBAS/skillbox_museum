import type { SceneNumber } from '@/uikit/ScenePill/ScenePill'
import type { Theme } from '@/uikit'
const descriptions: Record<SceneNumber, string> = {
  1: 'Телефон и часы на прикроватном столике',
  2: 'Телефон в вагоне метро, подключение к публичному Wi-Fi',
  3: 'Кофе, телефон и табличка с QR-кодом на столе кафе',
  4: 'Общий компьютер с открытым окном сохранения пароля',
  5: 'Электросамокат и телефон с запросами разрешений',
  6: 'Телефон с уведомлением банка о списании денег',
  7: 'Входящий звонок с неизвестного номера',
  8: 'Фото стола с пиццей, чеком, пропуском и банковской картой',
  9: 'Умная колонка, роутер и домашняя камера',
  10: 'Телефон с уведомлениями о безопасности аккаунта',
}
export function sceneVisual(n: SceneNumber, step: 'intro' | 'quiz', theme: Theme = 'light') {
  const imageStep = n === 1 ? 'intro' : step
  // Original illustrations follow the story's time of day; each has an alternate.
  const originalTheme = n >= 7 || (n === 2 && imageStep === 'quiz') ? 'dark' : 'light'
  const suffix = theme === originalTheme ? '' : `-${theme}`
  const src = `/images/pixel/${String(n).padStart(2, '0')}-${imageStep}${suffix}.webp`
  return {
    src,
    srcSet: `${src.replace('.webp', '-768.webp')} 768w, ${src} 1536w`,
    alt: `${theme === 'light' ? 'День' : 'Ночь'}: ${descriptions[n]}`,
  }
}
