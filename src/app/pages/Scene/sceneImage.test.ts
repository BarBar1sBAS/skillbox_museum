import { describe, expect, it } from 'vitest'
import { sceneImageSources, splitLead } from './Scene.tsx'

const src = '/images/scenes/06-intro.png'

describe('sceneImageSources', () => {
  it('сначала пробует десктопный и светлый варианты, потом обычную картинку', () => {
    expect(sceneImageSources(src, 'light', true)).toEqual([
      '/images/scenes/06-intro-desktop-light.png',
      '/images/scenes/06-intro-desktop.png',
      '/images/scenes/06-intro-light.png',
      src,
    ])
  })

  it('запрашивает только то, что нужно текущему экрану', () => {
    expect(sceneImageSources(src, 'dark', true)).toEqual([
      '/images/scenes/06-intro-desktop.png',
      src,
    ])
    expect(sceneImageSources(src, 'light', false)).toEqual([
      '/images/scenes/06-intro-light.png',
      src,
    ])
    expect(sceneImageSources(src, 'dark', false)).toEqual([src])
  })
})

describe('splitLead', () => {
  it('делит по первому двоеточию и оставляет строку целиком, если его нет', () => {
    expect(splitLead('Важно: не делись')).toEqual({
      lead: 'Важно:',
      rest: ' не делись',
    })
    expect(splitLead('без двоеточия')).toEqual({
      lead: '',
      rest: 'без двоеточия',
    })
  })
})
