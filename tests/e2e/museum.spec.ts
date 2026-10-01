import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const correct = [1, 2, 1, 1, 2, 2, 2, 2, 1, 0]
async function noOverflow(page: import('@playwright/test').Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true)
}
test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"id":"browser-check"}',
    }),
  )
})
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${theme} ${width}: start, long scene, result and final`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(
        (theme) => localStorage.setItem('theme', theme),
        theme,
      )
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByRole('img')).toHaveJSProperty('complete', true)
      await noOverflow(page)
      await page.screenshot({
        path: `test-results/start-${theme}-${width}.png`,
        fullPage: true,
      })
      await page.goto('/scene/3')
      await page.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }).click()
      await expect(page.getByRole('radio')).toHaveCount(3)
      await noOverflow(page)
      const violations = (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations
      expect(
        violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([])
      await page.screenshot({
        path: `test-results/scene-${theme}-${width}.png`,
        fullPage: true,
      })
      await page.goto('/result')
      await noOverflow(page)
      await page.getByRole('button', { name: 'ПОДРОБНЕЕ О РЕЗУЛЬТАТЕ' }).click()
      await noOverflow(page)
      await page.keyboard.press('Escape')
      await page.goto('/final')
      await noOverflow(page)
    })
  }
}
test('ten correct answers, rewards, refresh, coupon and replay', async ({
  page,
}) => {
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'PATCH' && request.postData()?.includes('"scene"'))
      requests.push(request.postData()!)
  })
  await page.goto('/rules')
  await page.getByRole('button', { name: 'НАЧАТЬ', exact: true }).click()
  for (let n = 1; n <= 10; n++) {
    await expect(page).toHaveURL(`/scene/${n}`)
    await page.locator('main section button').last().click()
    await expect(
      page.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }),
    ).toBeDisabled()
    await page
      .getByRole('radio')
      .nth(correct[n - 1])
      .check()
    if (n === 1) {
      await page.reload()
      await expect(page.getByRole('radio').nth(1)).toBeChecked()
    }
    await page.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }).click()
    if ([3, 6, 9].includes(n)) {
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByRole('dialog')).toContainText('ПОЛУЧЕН')
      await page.keyboard.press('Escape')
    }
    await page.reload()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(
      page.getByText('ВЕРНОЕ РЕШЕНИЕ', { exact: true }),
    ).toBeVisible()
    await page
      .getByRole('button', {
        name: n < 10 ? 'ПРОДОЛЖИТЬ' : 'УЗНАТЬ РЕЗУЛЬТАТ',
        exact: true,
      })
      .click()
  }
  expect(requests).toHaveLength(10)
  await expect(page.getByText('10 из 10')).toBeVisible()
  await page.getByRole('button', { name: 'ПЕРЕЙТИ К ШИФРУ' }).click()
  await expect(page.getByText('ОТКРЫТА СКИДКА 10%')).toBeVisible()
  await expect(page.getByText('Получен', { exact: true })).toHaveCount(3)
  await page.screenshot({
    path: 'test-results/final-success.png',
    fullPage: true,
  })
  await page.getByRole('button', { name: 'ПОВТОРИТЬ' }).click()
  expect(
    await page.evaluate(() => sessionStorage.getItem('progress')),
  ).toBeNull()
  expect(
    await page.evaluate(() => sessionStorage.getItem('scene-session-v1')),
  ).toBeNull()
})
test('keyboard choices, reduced motion, failed images, zoom and clipboard refusal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 900 })
  await page.goto('/scene/10')
  await page.getByRole('button', { name: 'ОТКРЫТЬ ОПОВЕЩЕНИЕ' }).click()
  await expect(
    page.getByText(/Обнаружен вход с нового устройства/),
  ).toBeVisible()
  await page.getByRole('radio').first().focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('radio').nth(1)).toBeChecked()
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2'
  })
  await noOverflow(page)
  await page.route('**/images/pixel/**', (route) => route.abort())
  await page.goto('/scene/9')
  await expect(page.locator('figcaption')).toBeVisible()
  await page.goto('/final')
  await page.evaluate(() =>
    sessionStorage.setItem(
      'progress',
      '{"1":"correct","2":"correct","3":"correct"}',
    ),
  )
  await page.reload()
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
      configurable: true,
    }),
  )
  await page.getByRole('button', { name: 'Скопировать CRYPTO5' }).click()
  await expect(page.getByRole('textbox', { name: 'Промокод' })).toHaveValue(
    'CRYPTO5',
  )
  await expect(page.getByRole('status')).toContainText('Скопируй код вручную')
})
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${theme} ${width}: 200% scale and reward`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(
        (theme) => localStorage.setItem('theme', theme),
        theme,
      )
      for (const route of ['/', '/rules', '/scene/10', '/result', '/final']) {
        await page.goto(route)
        await page.evaluate(() => {
          document.documentElement.style.zoom = '2'
        })
        await noOverflow(page)
      }
      await page.evaluate(() =>
        sessionStorage.setItem('progress', '{"1":"correct","2":"correct"}'),
      )
      await page.goto('/scene/3')
      await page.getByRole('button', { name: 'СЕСТЬ ЗА СТОЛИК' }).click()
      await page.getByRole('radio').nth(1).check()
      await page.getByRole('button', { name: 'ПОДТВЕРДИТЬ ВЫБОР' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await noOverflow(page)
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations.map((v) => v.id),
      ).toEqual([])
      await page.screenshot({
        path: `test-results/reward-${theme}-${width}.png`,
        fullPage: true,
      })
    })
  }
}
for (const keys of [0, 1, 2, 3]) {
  test(`final ${keys} keys: coupon and accessibility`, async ({ page }) => {
    await page.goto('/')
    await page.evaluate(
      (keys) =>
        sessionStorage.setItem(
          'progress',
          JSON.stringify(
            Object.fromEntries(
              Array.from({ length: keys * 3 }, (_, i) => [i + 1, 'correct']),
            ),
          ),
        ),
      keys,
    )
    await page.goto('/final')
    await expect(page.getByText('Получен', { exact: true })).toHaveCount(keys)
    if (keys)
      await expect(
        page.getByRole('button', {
          name: `Скопировать CRYPTO${[0, 5, 7, 10][keys]}`,
        }),
      ).toBeVisible()
    else
      await expect(
        page.getByRole('button', { name: /Скопировать/ }),
      ).toHaveCount(0)
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations.map((v) => v.id),
    ).toEqual([])
  })
}
test('all scene illustrations stay readable on mobile and load responsive sources', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (let n = 1; n <= 10; n++) {
    await page.goto(`/scene/${n}`)
    await expect
      .poll(() =>
        page
          .getByRole('img')
          .first()
          .evaluate(
            (img: HTMLImageElement) =>
              img.complete &&
              img.naturalWidth > 0 &&
              img.currentSrc.endsWith('-768.webp'),
          ),
      )
      .toBe(true)
    await page.locator('main section button').last().click()
    await expect
      .poll(() =>
        page
          .getByRole('img')
          .first()
          .evaluate(
            (img: HTMLImageElement) =>
              img.complete &&
              img.naturalWidth > 0 &&
              img.currentSrc.endsWith('-768.webp'),
          ),
      )
      .toBe(true)
    await noOverflow(page)
    await page.screenshot({
      path: `test-results/mobile-scene-${n}.png`,
      fullPage: true,
    })
  }
})
