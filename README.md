# Музей криптографии

Интерактив музея: React 19, Vite 8, TypeScript. Стили — SCSS Modules и CSS-переменные в [`src/styles/tokens/`](src/styles/tokens/). Tailwind в проекте нет. Пакетный менеджер — [Bun](https://bun.sh).

UI kit живёт в Storybook. Экраны приложения собираются из тех же компонентов в `src/app`.

## Быстрый старт

```bash
bun install
bun run storybook   # http://localhost:6006 — каталог компонентов
bun run dev         # приложение: / лендинг, /start, /rules, /scene/:n, /result, /final
bun run test
bun run test:coverage
```

Сторисы подхватываются из `src/uikit/**/*.stories.tsx` (см. [`.storybook/main.ts`](.storybook/main.ts)). Фон превью — `#081B55`, как в макете ([`.storybook/preview.tsx`](.storybook/preview.tsx)).

Глобальные стили и шрифты уже подключены в превью через [`src/styles/index.scss`](src/styles/index.scss). В сторисах их не импортируют повторно.

## Карта репозитория

| Путь | Зачем |
|------|--------|
| [`src/uikit/`](src/uikit/) | Компоненты и сторисы. Публичный вход — [`src/uikit/index.ts`](src/uikit/index.ts) |
| [`src/app/`](src/app/) | Роутер и страницы: `/` → [`Landing`](src/app/pages/Landing/Landing.tsx), `/start` → [`Start`](src/app/pages/Start/Start.tsx), `/rules` → [`Rules`](src/app/pages/Rules/Rules.tsx), `/scene/:n` → [`Scene`](src/app/pages/Scene/Scene.tsx), `/result` → [`Result`](src/app/pages/Result/Result.tsx), `/final` → [`Final`](src/app/pages/Final/Final.tsx) |
| [`src/styles/`](src/styles/) | Токены: `--color-*`, `--gradient-*`, `--border-card`, `--shadow-*`, `--font-*`, `--spacing-*`, `--radius-*`. Подключаются один раз в [`src/main.tsx`](src/main.tsx) |

Алиас `@/` указывает на `src/` (см. [`vite.config.ts`](vite.config.ts)). Из приложения импортируют так:

```ts
import { Stack, Text, ChoiceCard } from '@/uikit/index.ts'
```

Внутри UI kit — только относительные пути (`../Text/Text.tsx`), не `@/`.

## Как работать со Storybook

Слева два раздела:

- **Foundations** — Colors, Typography, Radius: шкала токенов, не компоненты экрана.
- **UIkit** — готовые блоки. У компонента обычно `Default`, отдельные варианты и `All` (колонка через `Stack` с `gap={20}`).

**Docs** и панель Controls крутят пропы без правки кода. Сторис — витрина: в прод импортируют компонент из `@/uikit/index.ts`, а не копируют JSX из Docs.

### Новый компонент

В папке `src/uikit/Имя/`:

1. `Имя.tsx` + `Имя.module.scss`
2. `Имя.stories.tsx` — `title: 'UIkit/Имя'`
3. один маленький `Имя.test.tsx` (проверка, которая падает, если сломать логику)
4. реэкспорт из [`src/uikit/index.ts`](src/uikit/index.ts)

Абсолютную вёрстку из Figma не копируют — flex и токены. Разовый hex или кегль оставляют в модуле; повторяющееся (градиент и обводка карточки) — в [`src/styles/tokens/`](src/styles/tokens/).

## Каталог компонентов

Пропы — как в коде. Типы реэкспортируются из `index.ts`.

### Примитивы

**Text** — типографика из шкалы.

| Проп | Значения | По умолчанию |
|------|----------|----------------|
| `variant` | `h1` `h2` `h3` `h3Bold` `cta` `h4` `eyebrow` `subtitle` `kicker` `fineprint` `bodyL` `bodyM` `bodyMBold` `bodyS` `logo` `cipher` | `bodyM` |
| `color` | `primary` `muted` `onAccent` `accent` | `primary` |
| `as` | `p` `span` `h1` `h2` `h3` `h4` | `p` |

У `cipher` и `fineprint` в самом `Text` уже `opacity: 0.7`. `muted` — 50% белого, не подгонять под другие прозрачности макета.

**Stack** — вертикальный flex. `gap` только `10 | 14 | 20 | 25` (пиксели из `--spacing-*`). По умолчанию `20`.

### Блоки

**PromoCode** — `percent: 5 | 7 | 10`, `code: string`. Клик по пунктирному полю копирует код в буфер.

**ScenePill** — `n: 1…10`, опционально `onClick`. Кнопка «сцена N».

**StatusMark** — `tone: 'lime' | 'orange' | 'red'` (успех / внимание / ошибка).

**TrustChip** — `label?`, `active?`. Блок-чип ключа, не кнопка.

**ChoiceCard** — `children: string`, `selected?`, `onClick?`. Внутри `<label>` и нативный `<input type="radio">`. Состояние выбранности держит родитель.

**ChatCard** — `reveal?: 0 | 1 | 2 | 3` (по умолчанию `0`). Тексты зашиты: сколько первых строк уже расшифровано.

**Button** — `size?: 'm' | 'l'`, `variant?: 'solid' | 'outline'`, `arrow?`. Outline — прозрачный фон и обводка `--color-cyan`.

**ScoreRing** — `value: number` (клэмп 0…100). Кольцо индекса, `role="progressbar"`.

**StatBar** — `label: string`, `value: number` (клэмп 0…100). Подпись, `N/100` и линейный бар.

**Modal** — `onClose`, `closeButton?` (по умолчанию нет). Оверлей: фон, Esc, клик по подложке. Крестик опционален, чтобы не плодить вторую кнопку «Закрыть» вокруг `KeyModal`.

**KeyModal** — `step?: 1 | 2 | 3` (по умолчанию `1`). Карточка 327×327 «ключ получен». Это не оверлей: оборачивают в `Modal`.

Иконки лежат в [`src/uikit/icons/`](src/uikit/icons/), витрина — сторис `UIkit/Icons`. Новые глифы — экспорт из Figma, SVG руками не рисуют.

## Интеграция в лейаут

Экран живёт в `src/app/pages/…`. Каркас как у Landing / Start / Rules: `<main>` и модуль страницы с `min-height: 100dvh`, фон `--background-default`, отступы из `--spacing-*`.

Сборка — `Stack` по вертикали, компоненты рядом, без лишних обёрток. Состояние экрана (выбранный ответ, шаг ключа) — в странице, не внутри UI kit.

В своей вёрстке страницы используют токены: `var(--spacing-20)`, `var(--radius-l)`, `var(--color-cyan)`. Цвет или кегль, которого нет в шкале, оставляют локально в SCSS модуля.

Пример controlled-сборки (это образец для игрового экрана, не копировать в существующие страницы):

```tsx
import { useState } from 'react'
import { ChatCard, ChoiceCard, Stack, StatusMark, Text } from '@/uikit/index.ts'
import styles from './Scene.module.scss'

export function Scene() {
  const [picked, setPicked] = useState(0)

  return (
    <main className={styles.page}>
      <Stack gap={20}>
        <StatusMark tone="lime" />
        <Text as="h2" variant="h2">
          ТЫ РАСПОЗНАЛ УГРОЗУ
        </Text>
        <ChoiceCard selected={picked === 0} onClick={() => setPicked(0)}>
          Напишу ему в том же чате и проверю, что это именно он.
        </ChoiceCard>
        <ChoiceCard selected={picked === 1} onClick={() => setPicked(1)}>
          Переведу деньги, раз пишет знакомый номер.
        </ChoiceCard>
        <ChatCard reveal={2} />
      </Stack>
    </main>
  )
}
```

Новый маршрут добавляют в [`src/app/routes.tsx`](src/app/routes.tsx).

## Правила, которые ломают чужой код

- Из `src/app` не импортировать компонент минуя [`src/uikit/index.ts`](src/uikit/index.ts).
- Не ставить Tailwind.
- Не копировать absolute-вёрстку из Figma.
- `KeyModal` — только карточка. Оверлей — `Modal` (`onClose`, Esc, фон). Фокус-трап и lock скролла в комплект не входят.
- `ChoiceCard` — выбор через `onClick` родителя и проп `selected`. Не вешать `role="radio"` на `button`.

## Команды

| Команда | Что делает |
|---------|------------|
| `bun run dev` | Vite, приложение |
| `bun run storybook` | Storybook на порту 6006 |
| `bun run test` | Vitest, один прогон |
| `bun run test:coverage` | Vitest с v8-покрытием, порог 100% |
| `bun run test:watch` | Vitest в watch |
| `bun run lint` | oxlint |
| `bun run build` | `tsc -b` и production-сборка Vite |
| `bun run preview` | превью production-сборки |
| `bun run build-storybook` | статическая сборка Storybook |
