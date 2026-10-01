import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PixelScene } from './PixelScene'
it('сохраняет описание и завершает обработку ошибки загрузки', () => {
  render(
    <PixelScene src="/images/pixel/01-intro.png" alt="Телефон у кровати" />,
  )
  const img = screen.getByRole('img', { name: 'Телефон у кровати' })
  fireEvent.error(img)
  expect(screen.getByText('Телефон у кровати')).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
it('предлагает браузеру адаптивный источник без потери описания', () => {
  render(
    <PixelScene
      src="/images/pixel/01-intro.webp"
      srcSet="/images/pixel/01-intro-768.webp 768w, /images/pixel/01-intro.webp 1536w"
      alt="Утро"
    />,
  )
  expect(screen.getByRole('img', { name: 'Утро' })).toHaveAttribute(
    'srcset',
    '/images/pixel/01-intro-768.webp 768w, /images/pixel/01-intro.webp 1536w',
  )
  expect(screen.getByRole('img', { name: 'Утро' })).toHaveAttribute(
    'sizes',
    '(min-width: 900px) 560px, calc(100vw - 40px)',
  )
})
