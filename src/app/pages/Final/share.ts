import { EXHIBITION_URL } from '@/uikit/museum.ts'

type ShareResult = {
  score: number
  keyCount: 0 | 1 | 2 | 3
}

const KEY_WORD = ['ключей', 'ключ', 'ключа', 'ключа'] as const

export function shareCopy({ score, keyCount }: ShareResult) {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin)
  const testUrl = import.meta.env.VITE_GITHUB_PAGES === 'true'
    ? `${base.href}#/start`
    : new URL('start', base).href
  return {
    title: 'На грани доверия',
    text: `Мой индекс цифровой безопасности — ${score} из 100. Я собрал(а) ${keyCount} из 3 ключей. Пройди тест и проверь себя, а затем приходи на выставку «Ключ к доверию» в Музее криптографии: ${EXHIBITION_URL}`,
    url: testUrl,
  }
}

export async function createShareCard({ score, keyCount }: ShareResult) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')

  context.fillStyle = '#00001A'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#0B4AF9'
  context.fillRect(0, 0, 1080, 30)
  context.fillRect(830, 90, 110, 110)
  context.fillStyle = '#02CEFB'
  context.fillRect(940, 90, 70, 70)
  context.fillStyle = '#22EE88'
  context.fillRect(1010, 90, 30, 30)

  context.fillStyle = '#02CEFB'
  context.font = '700 34px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText('НА ГРАНИ ДОВЕРИЯ', 80, 140)

  context.fillStyle = '#FFFFFF'
  context.font = '700 92px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText('МОЙ ИНДЕКС', 80, 300)
  context.fillText('ЦИФРОВОЙ', 80, 405)
  context.fillText('БЕЗОПАСНОСТИ', 80, 510)

  context.fillStyle = '#22EE88'
  context.font = '700 210px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText(String(score), 70, 760)
  context.font = '700 70px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText('ИЗ 100', 430, 750)

  context.strokeStyle = '#2A2A46'
  context.lineWidth = 2
  context.strokeRect(80, 840, 920, 170)
  context.fillStyle = '#FFFFFF'
  context.font = '700 54px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText(`СОБРАНО ${keyCount} ${KEY_WORD[keyCount].toUpperCase()}`, 120, 930)
  context.fillStyle = '#A6A6B5'
  context.font = '400 30px "Halvar Mittelschrift", Arial, sans-serif'
  context.fillText('Из трёх ключей цифрового доверия', 120, 975)

  context.fillStyle = '#FFFFFF'
  context.font = '700 40px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText('ПРОЙДИ ТЕСТ И ПРОВЕРЬ СЕБЯ', 80, 1120)
  context.fillStyle = '#02CEFB'
  context.font = '700 30px "Halvar Breitschrift", Arial, sans-serif'
  context.fillText('ВЫСТАВКА «КЛЮЧ К ДОВЕРИЮ»', 80, 1195)
  context.fillStyle = '#A6A6B5'
  context.font = '400 27px "Halvar Mittelschrift", Arial, sans-serif'
  context.fillText('МУЗЕЙ КРИПТОГРАФИИ', 80, 1250)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  )
  if (!blob) throw new Error('PNG creation failed')
  return new File([blob], 'moy-rezultat.png', { type: 'image/png' })
}

function download(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}

export async function shareResult(result: ShareResult) {
  const copy = shareCopy(result)
  const file = await createShareCard(result)

  try {
    if (navigator.share) {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ ...copy, files: [file] })
      } else {
        await navigator.share(copy)
      }
      return 'Публикация передана в выбранное приложение.'
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return ''
  }

  download(file)
  const copied = await navigator.clipboard?.writeText(copy.text).then(
    () => true,
    () => false,
  )
  return copied
    ? 'Карточка сохранена, текст скопирован.'
    : 'Карточка сохранена — добавьте её к публикации.'
}
