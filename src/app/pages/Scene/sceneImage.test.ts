import { describe, expect, it } from 'vitest'
import { sceneImageSources, splitLead } from './Scene.tsx'

const src = '/images/scenes/06-intro.png'

describe('sceneImageSources', () => {
  it('tries desktop and light variants before the plain image', () => {
    expect(sceneImageSources(src, 'light', true)).toEqual([
      '/images/scenes/06-intro-desktop-light.png',
      '/images/scenes/06-intro-desktop.png',
      '/images/scenes/06-intro-light.png',
      src,
    ])
  })

  it('asks only for what the current screen needs', () => {
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
  it('splits on the first colon and keeps the whole string without one', () => {
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
