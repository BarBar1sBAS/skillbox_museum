import { describe, expect, it } from 'vitest'
import '../../styles/index.scss'
describe('exhibition tokens', () => {
  it('uses the exhibition palette and readable typography', () => {
    const styles = getComputedStyle(document.documentElement)
    expect(styles.getPropertyValue('--background-default').trim()).toBe(
      '#15141a',
    )
    expect(styles.getPropertyValue('--color-accent').trim()).toBe('#02cefb')
    expect(styles.getPropertyValue('--font-bodyM-size').trim()).toBe('1rem')
    expect(styles.getPropertyValue('--radius-l').trim()).toBe('0')
    expect(styles.getPropertyValue('--reward').trim()).toBe('#22ee88')
  })
  it('switches to light brand tokens without changing the reward role', () => {
    document.documentElement.dataset.theme = 'light'
    const styles = getComputedStyle(document.documentElement)
    expect(styles.getPropertyValue('--background-default').trim()).toBe(
      '#e9e9ef',
    )
    expect(styles.getPropertyValue('--color-accent').trim()).toBe('#0b4af9')
    expect(styles.getPropertyValue('--text-primary').trim()).toBe('#00001a')
    delete document.documentElement.dataset.theme
  })
})
