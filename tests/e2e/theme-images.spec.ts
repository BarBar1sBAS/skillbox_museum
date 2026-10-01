import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
test(`day and night illustrations follow the theme at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 })
  await page.route('**/api/**', route => route.fulfill({
    contentType: 'application/json', body: '{"id":"theme-images"}',
  }))
  for (const route of ['/start', '/scene/2', '/scene/8', '/final']) {
    await page.goto(route)
    const image = page.locator('figure img').first()
    const toggle = page.getByRole('switch')
    const before = await image.getAttribute('src')
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    if (route === '/start') await page.screenshot({ path: testInfo.outputPath('start-light.png'), fullPage: true })
    await toggle.click()
    await expect(image).not.toHaveAttribute('src', before!)
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    if (route === '/start') await page.screenshot({ path: testInfo.outputPath('start-dark.png'), fullPage: true })
    const after = await image.getAttribute('src')
    await expect(page.locator('figure img').nth(1)).toHaveAttribute('src', after!)
    await page.reload()
    await expect(image).toHaveAttribute('src', after!)
    await toggle.click()
    await expect(image).toHaveAttribute('src', before!)
  }
  await page.goto('/scene/3')
  await page.locator('main section button').last().click()
  const choice = page.getByRole('radio').first()
  await choice.check()
  const image = page.locator('figure img').first()
  const before = await image.getAttribute('src')
  await page.getByRole('switch').click()
  await expect(image).not.toHaveAttribute('src', before!)
  await expect(choice).toBeChecked()
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
})
}
