import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createShareCard, shareCopy, shareResult } from './share.ts'

const context = {
  fillRect: vi.fn(),
  fillText: vi.fn(),
  strokeRect: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  font: '',
  lineWidth: 0,
} as unknown as CanvasRenderingContext2D

function setNavigator(name: 'share' | 'canShare' | 'clipboard', value: unknown) {
  Object.defineProperty(navigator, name, { value, configurable: true })
}

describe('share result', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      (callback) => callback(new Blob(['png'], { type: 'image/png' })),
    )
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:card'),
      configurable: true,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(),
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    for (const name of ['share', 'canShare', 'clipboard']) {
      Reflect.deleteProperty(navigator, name)
    }
  })

  it('передаёт PNG и результат в системное меню', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    setNavigator('share', share)
    setNavigator('canShare', vi.fn(() => true))

    await expect(shareResult({ score: 100, keyCount: 3 })).resolves.toBe(
      'Публикация передана в выбранное приложение.',
    )

    const data = share.mock.calls[0][0] as ShareData
    expect(data.files?.[0]).toMatchObject({
      name: 'moy-rezultat.png',
      type: 'image/png',
    })
    expect(data.text).toContain('100 из 100')
    expect(data.text).toContain('3 из 3 ключей')
    expect(data.text).toContain('cryptography-museum.ru/events/')
    expect(data.url).toBe(`${window.location.origin}/start`)
  })

  it('делится текстом, если файлы не поддерживаются', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    setNavigator('share', share)

    await shareResult({ score: 0, keyCount: 0 })

    expect(share).toHaveBeenCalledWith(
      expect.not.objectContaining({ files: expect.anything() }),
    )
    expect(share.mock.calls[0][0].text).toContain('0 из 3 ключей')
  })

  it('скачивает карточку и копирует текс при ошибке share', async () => {
    setNavigator('share', vi.fn().mockRejectedValue(new Error('denied')))
    setNavigator('clipboard', { writeText: vi.fn().mockResolvedValue(undefined) })

    await expect(shareResult({ score: 40, keyCount: 1 })).resolves.toBe(
      'Карточка сохранена, текст скопирован.',
    )
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
  })

  it('скачивает карточку, если Web Share и clipboard недоступны', async () => {
    await expect(shareResult({ score: 70, keyCount: 2 })).resolves.toBe(
      'Карточка сохранена — добавьте её к публикации.',
    )
  })

  it('учитывает отказ clipboard и отмену системного меню', async () => {
    setNavigator('share', vi.fn().mockRejectedValue(new DOMException('', 'AbortError')))
    setNavigator('clipboard', { writeText: vi.fn().mockRejectedValue(new Error()) })
    await expect(shareResult({ score: 10, keyCount: 0 })).resolves.toBe('')
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled()

    setNavigator('share', undefined)
    await expect(shareResult({ score: 10, keyCount: 0 })).resolves.toContain(
      'Карточка сохранена',
    )
  })

  it('строит hash-ссылку для GitHub Pages', () => {
    vi.stubEnv('VITE_GITHUB_PAGES', 'true')
    expect(shareCopy({ score: 0, keyCount: 0 }).url).toBe(
      `${window.location.origin}/#/start`,
    )
  })

  it('сообщает, если Canvas или PNG недоступны', async () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
    await expect(createShareCard({ score: 0, keyCount: 0 })).rejects.toThrow(
      'Canvas is unavailable',
    )

    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
      (callback) => callback(null),
    )
    await expect(createShareCard({ score: 0, keyCount: 0 })).rejects.toThrow(
      'PNG creation failed',
    )
  })
})
