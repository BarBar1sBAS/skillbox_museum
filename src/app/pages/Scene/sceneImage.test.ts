import { expect, it } from 'vitest'
import { sceneVisual } from '@/app/scenes/visuals'
import { scenes } from '@/app/scenes'
it('каждая сцена имеет картинку и текстовую альтернативу для обоих этапов', () => {
  for (const scene of Object.values(scenes)) {
    for (const step of ['intro', 'quiz'] as const) {
      const image = sceneVisual(scene.n, step)
      expect(image.src).toMatch(/images\/pixel\/\d{2}-(intro|quiz)\.webp$/)
      expect(image.alt.length).toBeGreaterThan(15)
    }
    expect(scene.situation.length).toBeGreaterThan(10)
  }
})
