import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{"id":"layout-check"}' }))
})
for (const theme of ['light', 'dark']) {
  for (const [width, height] of [[320,568], [390,844], [768,1024], [899,700], [900,700], [1440,900], [844,390]]) {
    test(`${theme} ${width}x${height}: control geometry and statistics`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme)
      await page.goto('/result')
      const toggle = page.getByRole('switch')
      for (let state = 0; state < 2; state++) {
        const geometry = await toggle.evaluate(button => {
          const knob = button.querySelector('span')!.getBoundingClientRect()
          const icons = button.querySelectorAll('img')
          const icon = icons[button.getAttribute('aria-checked') === 'true' ? 1 : 0].getBoundingClientRect()
          return { dx: Math.abs(knob.x + knob.width / 2 - icon.x - icon.width / 2), dy: Math.abs(knob.y + knob.height / 2 - icon.y - icon.height / 2) }
        })
        expect(geometry.dx).toBeLessThanOrEqual(1)
        expect(geometry.dy).toBeLessThanOrEqual(1)
        if (width === 390) await toggle.screenshot({ path: `test-results/toggle-${theme}-${state}.png` })
        await toggle.click()
      }
      const trigger = page.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' })
      await trigger.click()
      const dialog = page.getByRole('dialog')
      const close = dialog.getByRole('button', { name: 'Закрыть' })
      const geometry = await dialog.evaluate(root => {
        const card = root.getBoundingClientRect()
        const close = root.querySelector('button')!.getBoundingClientRect()
        return { rightGap: card.right - close.right, topGap: close.top - card.top, closeRight: close.right, closeBottom: close.bottom, contentTop: root.lastElementChild!.getBoundingClientRect().top, contentWidth: root.lastElementChild!.getBoundingClientRect().width, cardWidth: card.width }
      })
      expect(geometry.rightGap).toBeGreaterThanOrEqual(0)
      expect(geometry.rightGap).toBeLessThanOrEqual(24)
      expect(geometry.topGap).toBeGreaterThanOrEqual(0)
      expect(geometry.closeRight).toBeLessThanOrEqual(width)
      expect(geometry.closeBottom).toBeLessThanOrEqual(height)
      expect(geometry.closeBottom).toBeLessThanOrEqual(geometry.contentTop)
      expect(Math.abs(geometry.cardWidth - geometry.contentWidth)).toBeLessThanOrEqual(2)
      await expect(close).toBeFocused()
      await page.keyboard.press('Tab')
      const content = dialog.getByRole('region')
      await expect(content).toBeFocused()
      await page.keyboard.press('End')
      await expect.poll(() => content.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThanOrEqual(1)
      await expect(close).toBeInViewport()
      await page.keyboard.press('Tab')
      await expect(close).toBeFocused()
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
      await page.screenshot({ path: `test-results/statistics-${theme}-${width}.png` })
      await close.click()
      await expect(trigger).toBeFocused()
      await trigger.click()
      await page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
      await trigger.click()
      await page.getByRole('button', { name: 'Закрыть', exact: true }).first().click({ position: { x: 2, y: 2 } })
      await expect(dialog).toHaveCount(0)
    })
  }
}
test('theme keyboard and persistence', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('switch')
  await toggle.focus()
  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await page.reload()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
})

async function readable(page: import('@playwright/test').Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const clipped = await page.locator('button, p, h1, h2, h3').evaluateAll(elements => elements.filter(el => {
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && getComputedStyle(el).display !== 'inline' && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1
  }).map(el => el.textContent))
  expect(clipped).toEqual([])
}
for (const theme of ['light', 'dark']) {
  for (const [width, height] of [[320,568], [390,844], [768,1024], [899,700], [900,700], [1440,900], [844,390]]) {
    test(`${theme} ${width}: every scene and outcome layout`, async ({ page }) => {
      test.setTimeout(120000)
      await page.setViewportSize({ width, height })
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme)
      for (const route of ['/', '/rules', '/result', '/final']) {
        await page.goto(route)
        await readable(page)
      }
      for (let n = 1; n <= 10; n++) {
        await page.goto(`/scene/${n}`)
        await readable(page)
        await page.locator('main section button').last().click()
        await readable(page)
        await page.getByRole('radio').nth(n % 3).check()
        await page.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }).click()
        if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape')
        await readable(page)
        expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
        if (width === 390 && [1, 3, 10].includes(n)) await page.screenshot({ path: `test-results/answer-${theme}-${n}.png`, fullPage: true })
      }
    })
  }
  for (const width of [320, 1440]) {
    test(`${theme} ${width}: statistics at 200 percent`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 })
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme)
      await page.goto('/result')
      await page.evaluate(() => { document.documentElement.style.zoom = '2' })
      await page.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' }).click()
      await readable(page)
      const dialog = page.getByRole('dialog')
      const close = dialog.getByRole('button', { name: 'Закрыть' })
      await expect(close).toBeInViewport()
      await page.keyboard.press('Tab')
      await page.keyboard.press('End')
      const content = dialog.getByRole('region')
      await expect.poll(() => content.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThanOrEqual(1)
      await expect(close).toBeInViewport()
      await close.click()
      await expect(dialog).toHaveCount(0)
    })
  }
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: final variants on narrow screen`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme)
    await page.goto('/')
    for (const keys of [0, 1, 2, 3]) {
      await page.evaluate(keys => sessionStorage.setItem('progress', JSON.stringify(Object.fromEntries(Array.from({ length: keys * 3 }, (_, i) => [i + 1, 'correct'])))), keys)
      await page.goto('/final')
      await readable(page)
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(v => v.id)).toEqual([])
    }
  })
}

test('failed image description wraps at 200 percent', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.route('**/images/pixel/**', route => route.abort())
  await page.goto('/scene/10')
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  const caption = page.locator('figcaption')
  await expect(caption).toBeVisible()
  expect(await caption.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
})
