import type { SceneNumber } from '@/uikit/ScenePill/ScenePill'
const descriptions: Record<SceneNumber, string> = {
  1: 'Утро: телефон и часы на прикроватном столике',
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
export function sceneVisual(n: SceneNumber, step: 'intro' | 'quiz') {
  const src = `/images/pixel/${String(n).padStart(2, '0')}-${n === 1 ? 'intro' : step}.webp`
  return {
    src,
    srcSet: `${src.replace('.webp', '-768.webp')} 768w, ${src} 1536w`,
    alt: descriptions[n],
  }
}
