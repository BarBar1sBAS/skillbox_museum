import { describe, expect, it } from 'vitest'
import '../../styles/index.scss'

describe('tokens', () => {
  it('задаёт палитру Figma и переменные типографики на :root', () => {
    const styles = getComputedStyle(document.documentElement)
    expect(styles.getPropertyValue('--color-cyan').trim()).toBe('#29d8e6')
    expect(styles.getPropertyValue('--color-navy-deep').trim()).toBe('#081b55')
    expect(styles.getPropertyValue('--font-h1-size').trim()).toBe('1.625rem')
    expect(styles.getPropertyValue('--font-eyebrow-size').trim()).toBe('0.75rem')
    expect(styles.getPropertyValue('--font-cta-size').trim()).toBe('1.375rem')
    expect(styles.getPropertyValue('--radius-l').trim()).toBe('20')
    expect(styles.getPropertyValue('--spacing-10').trim()).toBe('10')
    expect(styles.getPropertyValue('--spacing-5').trim()).toBe('5')
    expect(styles.getPropertyValue('--spacing-15').trim()).toBe('15')
    expect(styles.getPropertyValue('--layout-phone').trim()).toBe('24.375rem')
    expect(styles.getPropertyValue('--layout-gutter').trim()).toBe('23')
    expect(styles.getPropertyValue('--border-width').trim()).toBe('1')
    expect(styles.getPropertyValue('--color-navy-screen').trim()).toBe('#071a52')
    expect(styles.getPropertyValue('--color-navy-bar').trim()).toBe('#192b83')
    expect(styles.getPropertyValue('--background-modal').trim()).toBe('#0e1849')
    expect(styles.getPropertyValue('--border-card').trim()).toBe('#36498d')
    expect(styles.getPropertyValue('--gradient-chat').trim()).toContain('linear-gradient')
    expect(styles.getPropertyValue('--gradient-result').trim()).toContain('linear-gradient')
  })
})
