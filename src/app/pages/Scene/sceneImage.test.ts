import { expect, it } from 'vitest'
import { sceneVisual } from '@/app/scenes/visuals'
import { scenes } from '@/app/scenes'
import { existsSync } from 'node:fs'
it('каждая сцена имеет картинку и текстовую альтернативу для обоих этапов', () => {
  for (const scene of Object.values(scenes)) {
    for (const step of ['intro', 'quiz'] as const) {
      for (const theme of ['light', 'dark'] as const) {
        const image = sceneVisual(scene.n, step, theme)
        expect(image.src).toMatch(/images\/pixel\/\d{2}-(intro|quiz)(-light|-dark)?\.webp$/)
        expect(image.alt.length).toBeGreaterThan(15)
        expect(existsSync(`public${image.src}`)).toBe(true)
        expect(existsSync(`public${image.src.replace('.webp', '-768.webp')}`)).toBe(true)
      }
      expect(sceneVisual(scene.n, step, 'light').src).not.toBe(sceneVisual(scene.n, step, 'dark').src)
    }
    expect(scene.situation.length).toBeGreaterThan(10)
  }
})
