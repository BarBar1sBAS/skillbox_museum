# Музей криптографии

Интерактив музея: React 19, Vite 8, TypeScript. Стили — SCSS Modules и CSS-переменные в [`src/styles/tokens/`](src/styles/tokens/). Tailwind в проекте нет. Пакетный менеджер — [Bun](https://bun.sh).

UI kit живёт в Storybook. Экраны приложения собираются из тех же компонентов в `src/app`.

## Быстрый старт

```bash
bun install
bun run storybook   # http://localhost:6006 — каталог компонентов
bun run dev         # приложение и /api на Vite
bun run test
bun run test:coverage
```

Маршруты: `/` и `/start` — старт, `/rules`, `/scene/:n` (1…10), `/result`, `/final`. Скрытая статистика — `/:key`, ключ берётся из `ADMIN_KEY`.

Продакшен: `bun run build`, затем `bun run start`. Сервер [`server/index.ts`](server/index.ts) отдаёт `dist` и `/api` на порту `PORT` (по умолчанию 4173).

Сторисы подхватываются из `src/uikit/**/*.stories.tsx` (см. [`.storybook/main.ts`](.storybook/main.ts)). Темы превью — светлая `#E9E9EF` и тёмная `#15141A`; переключатель в toolbar ([`.storybook/preview.tsx`](.storybook/preview.tsx)).

Глобальные стили и шрифты уже подключены в превью через [`src/styles/index.scss`](src/styles/index.scss). В сторисах их не импортируют повторно.

## Карта репозитория

| Путь | Зачем |
|------|--------|
| [`src/uikit/`](src/uikit/) | Компоненты и сторисы. Публичный вход — [`src/uikit/index.ts`](src/uikit/index.ts) |
| [`src/app/routes.tsx`](src/app/routes.tsx) | Маршруты |
| [`src/app/pages/`](src/app/pages/) | Экраны: [`Start`](src/app/pages/Start/Start.tsx), [`Rules`](src/app/pages/Rules/Rules.tsx), [`Scene`](src/app/pages/Scene/Scene.tsx), [`Result`](src/app/pages/Result/Result.tsx), [`Final`](src/app/pages/Final/Final.tsx), [`Admin`](src/app/pages/Admin/Admin.tsx) |
| [`src/app/scenes/`](src/app/scenes/) | Десять сцен, прогресс и очки по ключам |
| [`src/app/stats/track.ts`](src/app/stats/track.ts) | `sessionStorage` `runId`, `POST` и `PATCH` `/api/runs` |
| [`src/app/theme.ts`](src/app/theme.ts) | Тема в `localStorage` (`theme`), на `<html>` ставится `data-theme` |
| [`src/styles/`](src/styles/) | Токены: `--color-*`, `--gradient-*`, `--border-card`, `--shadow-*`, `--font-*`, `--spacing-*`, `--radius-*`. Подключаются один раз в [`src/main.tsx`](src/main.tsx) |
| [`server/`](server/) | SQLite (`STATS_DB` или `data/stats.sqlite`) и сводка. В dev `/api` проксируется из [`vite.config.ts`](vite.config.ts) |

Алиас `@/` указывает на `src/` (см. [`vite.config.ts`](vite.config.ts)). Из приложения импортируют так:

```ts
import { Stack, Text, ChoiceCard } from '@/uikit/index.ts'
```

Внутри UI kit — только относительные пути (`../Text/Text.tsx`), не `@/`.

## Прохождение

Десять ситуаций лежат в [`src/app/scenes/01`](src/app/scenes/01/scene.ts)…[`10`](src/app/scenes/10/scene.ts). Неверный номер в `/scene/:n` уводит на `/rules`.

Очки за ответ: верно 10, частично 4, неверно 0. Максимум 100. Ответы пишутся в `sessionStorage` (`progress`).

Ключи — «Доверие», «Данные», «Доступ». Целый ключ выдаётся за каждые 3 верных ответа по счёту. На экране результата доли считаются по блокам сцен: 1–3, 4–6 и 7–10.

Первая сцена открывает прохождение (`POST /api/runs`). Финал отправляет итог 0…100 и показывает промокод: `CRYPTO5`, `CRYPTO7` или `CRYPTO10` за 1, 2 или 3 ключа. Без ключей промокода нет.

Тема по умолчанию светлая. Переключатель пишет `dark` или `light` в `localStorage`.

## Статистика

`ADMIN_KEY` обязателен. Пустой ключ оставляет `GET /api/stats/:key` закрытым, а страница `/:key` возвращает на `/`.

Запись (`POST` и `PATCH`) принимается только с того же хоста: сравниваются `Origin` или `Referer` и хост запроса. Старт прохождения — не больше 10 раз в час с одного IP.

В dev API висит на Vite. В проде — `bun run build`, затем `bun run start`.

| Метод | Путь | Зачем |
|-------|------|--------|
| `POST` | `/api/runs` | новое прохождение, в ответе `{ id }` |
| `PATCH` | `/api/runs/:id` | ответ сцены `{ scene, outcome }` или финал `{ complete: true, score }` |
| `GET` | `/api/stats/:key` | сводка, если `:key` совпал с `ADMIN_KEY` |

`outcome` — `correct`, `partial` или `wrong`. `scene` — целое от 1 до 10.

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

### Каркас

**Page** — `<main>` экрана. `tone`: `landing` | `default` | `chat` | `result` (по умолчанию `default`). Опционально `className` и `data-scene`.

**Logo** и **Decor** — без пропов. Decor декоративный, для скринридеров скрыт.

**ThemeToggle** — `theme`: `dark` | `light` (по умолчанию `dark`), `onChange`. Состояние темы хранит страница через [`useTheme`](src/app/theme.ts).

**Stack** — вертикальный flex. `gap` только `10 | 14 | 20 | 25` (пиксели из `--spacing-*`). По умолчанию `20`.

### Примитивы

**Text** — типографика из шкалы.

| Проп | Значения | По умолчанию |
|------|----------|----------------|
| `variant` | `h1` `h2` `h3` `h3Bold` `cta` `h4` `eyebrow` `subtitle` `kicker` `fineprint` `bodyL` `bodyM` `bodyMBold` `bodyS` `logo` `cipher` | `bodyM` |
| `color` | `primary` `muted` `onAccent` `accent` | `primary` |
| `as` | `p` `span` `h1` `h2` `h3` `h4` | `p` |

У `cipher` и `fineprint` в самом `Text` уже `opacity: 0.7`. В тёмной теме `muted` — 50% белого.

### Блоки

**PromoCode** — `percent: 5 | 7 | 10`, `code: string`. Клик по пунктирному полю копирует код в буфер.

**ScenePill** — кнопка. Либо `n: 1…10` (подпись «сцена N»), либо `label` (свой текст). Опционально `onClick`.

**StatusMark** — `tone: 'lime' | 'orange' | 'red'` (успех / внимание / ошибка).

**TrustChip** — `label?` (по умолчанию «ДОВЕРИЕ»), `active?`. Блок-чип ключа, не кнопка.

**ChoiceCard** — `children: string`, `selected?`, `onClick?`. Внутри `<label>` и нативный `<input type="radio">`. Состояние выбранности держит родитель.

**ChatHeader** — шапка чата: `name`, `status`, опционально `onBack`.

**ChatBubble** — `time`, `children`. **VoiceBubble** — `duration`, `time`, `children`.

**ChatCard** — `reveal?: 0 | 1 | 2 | 3` (по умолчанию `0`). Тексты зашиты: сколько первых строк уже расшифровано.

**Button** — `size?: 's' | 'm' | 'l'`, `variant?: 'solid' | 'outline'`, `arrow?`. Outline — прозрачный фон и обводка `--color-cyan`.

**ScoreRing** — `value: number` (клэмп 0…100). Кольцо индекса, `role="progressbar"`.

**StatBar** — `label: string`, `value: number` (клэмп 0…100). Подпись, `N/100` и линейный бар.

**Modal** — `onClose`, `closeButton?` (по умолчанию нет). Оверлей: фон, Esc, клик по подложке. Крестик опционален, чтобы не плодить вторую кнопку «Закрыть» вокруг `KeyModal`.

**KeyModal** — `step?: 1 | 2 | 3` (по умолчанию `1`), `keyName?` (по умолчанию «ДАННЫЕ»). Карточка «ключ получен». Это не оверлей: оборачивают в `Modal`.

Иконки лежат в [`src/uikit/icons/`](src/uikit/icons/), витрина — сторис `UIkit/Icons`. Новые глифы — экспорт из Figma, SVG руками не рисуют.

## Интеграция в лейаут

Экран живёт в `src/app/pages/…`. Каркас — `Page`: фон и `min-height` уже внутри, тон задаёт `tone`. Отступы страницы — из `--spacing-*` в модуле страницы.

Сборка — `Stack` по вертикали, компоненты рядом, без лишних обёрток. Состояние экрана (выбранный ответ, тема, шаг ключа) — в странице, не внутри UI kit.

В своей вёрстке страницы используют токены: `var(--spacing-20)`, `var(--radius-l)`, `var(--color-cyan)`. Цвет или кегль, которого нет в шкале, оставляют локально в SCSS модуля.

```tsx
import { useState } from 'react'
import { ChoiceCard, Page, Stack, Text } from '@/uikit/index.ts'

export function Example() {
  const [picked, setPicked] = useState(0)

  return (
    <Page>
      <Stack gap={20}>
        <Text as="h1" variant="h1">
          Заголовок
        </Text>
        <ChoiceCard selected={picked === 0} onClick={() => setPicked(0)}>
          Первый вариант
        </ChoiceCard>
        <ChoiceCard selected={picked === 1} onClick={() => setPicked(1)}>
          Второй вариант
        </ChoiceCard>
      </Stack>
    </Page>
  )
}
```

Новый маршрут добавляют в [`src/app/routes.tsx`](src/app/routes.tsx). Путь из одного сегмента без своего маршрута попадает в админку `/:key`.

## Правила, которые ломают чужой код

- Из `src/app` не импортировать компонент минуя [`src/uikit/index.ts`](src/uikit/index.ts).
- Не ставить Tailwind.
- Не копировать absolute-вёрстку из Figma.
- `KeyModal` — только карточка. Оверлей — `Modal` (`onClose`, Esc, фон). Фокус-трап и lock скролла в комплект не входят.
- `ChoiceCard` — выбор через `onClick` родителя и проп `selected`. Не вешать `role="radio"` на `button`.

## Команды

| Команда | Что делает |
|---------|------------|
| `bun run dev` | Vite: приложение и `/api` |
| `bun run start` | прод-сервер: `dist` и `/api` |
| `bun run storybook` | Storybook на порту 6006 |
| `bun run test` | Vitest, один прогон |
| `bun run test:coverage` | Vitest с v8-покрытием, порог 100% |
| `bun run test:watch` | Vitest в watch |
| `bun run lint` | oxlint |
| `bun run build` | `tsc -b` и production-сборка Vite |
| `bun run preview` | превью production-сборки Vite, без `/api` |
| `bun run build-storybook` | статическая сборка Storybook |

## GitHub Pages

Сайт: https://barbar1sbas.github.io/skillbox_museum/

Workflow `.github/workflows/pages.yml` собирает и публикует `dist` при push в `main`.
В Settings → Pages источником должен быть GitHub Actions.
Для проверки такой сборки локально: `VITE_GITHUB_PAGES=true bun run build`, затем `VITE_GITHUB_PAGES=true bun run preview`.
Эта сборка использует базовый путь `/skillbox_museum/` и hash-маршруты для обновления внутренних страниц без 404.
Обычная локальная и серверная сборка сохраняет прежние URL.
GitHub Pages размещает только фронтенд: API статистики и серверная админка требуют отдельного сервера.

## Редизайн «Ключ к доверию»

Контекст продукта: [PRODUCT.md](PRODUCT.md). Палитра, композиция, типографика и движение: [DESIGN.md](DESIGN.md). Итоги проверки: [docs/visual-audit.md](docs/visual-audit.md).

Начинайте изменение поведения с падающего Vitest-теста UI kit, затем реализации и рефакторинга. `Museum/Exhibition UI kit` в Storybook показывает обе темы, выбор, фокус, длинные строки, награды, шифр и отказ загрузки иллюстрации. Компоненты UI kit не зависят от состояния приложения; адаптер музейной шапки подключает сохранённую тему.

`PixelScene` использует адаптивные WebP и ступенчатую маску; при ошибке выводит описание без маски. В `src/app/scenes/visuals.ts` находятся описания и источники 19 отдельных сюжетных кадров, каждый с дневным и ночным вариантом. Светлая тема показывает утро/день, тёмная — вечер/ночь; иллюстрации переключаются вместе с темой на стартовом экране, во всех сценах и в финале. Для каждого варианта доступны WebP шириной 768 и 1536 пикселей. Происхождение иллюстраций: [docs/illustrations.json](docs/illustrations.json). Старые изображения сохранены как исходные материалы, игровые экраны используют новый набор.

Этап и выбор хранятся в `sessionStorage` (`scene-session-v1`). Подтверждённые ответы (`progress`) имеют приоритет при восстановлении; обновление страницы не начисляет ключ и не отправляет ответ снова. Повтор игры очищает оба состояния. `ChatCard` раскрывает только `animateStep` нового ключа, а уже открытые строки остаются неподвижными. Reduced motion отключает глич и перебор.

Проверки перед push:

```bash
bun run test:coverage
bun run lint
bun run build
bun run build-storybook
bunx playwright install chromium  # один раз на новой машине
bun run test:e2e
VITE_GITHUB_PAGES=true bun run build
```

E2E поднимает изолированный сервер на `127.0.0.1:5180` и подменяет `/api/**`: тестовые прохождения не отправляются на рабочий сервер. Скриншоты и трассы сохраняются в `test-results/` (не коммитятся). GitHub Pages использует `/skillbox_museum/` и hash-маршруты; серверный API при этом не заменяется.
