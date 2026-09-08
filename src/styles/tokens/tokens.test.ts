import { describe, expect, it } from 'vitest'
import '../../styles/index.scss'

describe('tokens', () => {
  it('defines Figma palette and type vars on :root', () => {
    const styles = getComputedStyle(document.documentElement)
    expect(styles.getPropertyValue('--color-cyan').trim()).toBe('#29d8e6')
    expect(styles.getPropertyValue('--color-navy-deep').trim()).toBe('#081b55')
    expect(styles.getPropertyValue('--font-h1-size').trim()).toBe('1.625rem')
    expect(styles.getPropertyValue('--radius-l').trim()).toBe('20')
    expect(styles.getPropertyValue('--spacing-10').trim()).toBe('10')
    expect(styles.getPropertyValue('--border-card').trim()).toBe('#36498d')
    expect(styles.getPropertyValue('--gradient-chat').trim()).toContain('linear-gradient')
  })
})
