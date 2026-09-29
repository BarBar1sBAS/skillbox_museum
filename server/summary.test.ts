import { describe, expect, it } from 'vitest'
import { limited, sameHost, summarize, type Run } from './summary.ts'

function atNoon(year: number, month: number, day: number) {
  return new Date(year, month - 1, day, 12, 0, 0, 0).getTime()
}

describe('summarize', () => {
  const now = atNoon(2026, 9, 7)

  it('возвращает нули и первые четыре сцены, если никто не играл', () => {
    const summary = summarize([], now)
    expect(summary).toMatchObject({
      started: 0,
      completed: 0,
      completionRate: 0,
      avgIndex: 0,
      avgTimeSec: 0,
    })
    expect(summary.byDay.map((day) => day.label)).toEqual([
      '01.09',
      '02.09',
      '03.09',
      '04.09',
      '05.09',
      '06.09',
      '07.09',
    ])
    expect(summary.byDay.every((day) => day.count === 0)).toBe(true)
    expect(summary.topErrors).toEqual([
      { label: 'Просьба о переводе', percent: 0 },
      { label: 'Публичный Wi-Fi', percent: 0 },
      { label: 'Неизвестная ссылка', percent: 0 },
      { label: 'Сохранение пароля', percent: 0 },
    ])
  })

  it('считает только финалы, усредняет их и ранжирует неверные ответы', () => {
    const started = atNoon(2026, 9, 6)
    const runs: Run[] = [
      {
        startedAt: started,
        completedAt: started + (5 * 60 + 54) * 1000,
        score: 60,
        answers: { 1: 'wrong', 2: 'wrong', 5: 'correct' },
      },
      {
        startedAt: atNoon(2026, 9, 7),
        completedAt: atNoon(2026, 9, 7) + 66 * 1000,
        score: null,
        answers: { 1: 'correct', 2: 'partial', 5: 'wrong' },
      },
      {
        startedAt: atNoon(2026, 8, 31),
        completedAt: atNoon(2026, 8, 31) + 1000,
        score: 100,
        answers: { 3: 'wrong' },
      },
      {
        startedAt: atNoon(2026, 9, 7),
        completedAt: null,
        score: null,
        answers: { 5: 'wrong' },
      },
    ]

    const summary = summarize(runs, now)
    expect(summary.started).toBe(4)
    expect(summary.completed).toBe(3)
    expect(summary.completionRate).toBe(75)
    expect(summary.avgIndex).toBe(53.3)
    expect(summary.avgTimeSec).toBe(140)
    expect(summary.byDay.find((day) => day.label === '06.09')?.count).toBe(1)
    expect(summary.byDay.find((day) => day.label === '07.09')?.count).toBe(1)
    expect(summary.byDay.find((day) => day.label === '31.08')).toBeUndefined()
    expect(summary.topErrors).toEqual([
      { label: 'Неизвестная ссылка', percent: 100 },
      { label: 'Разрешения приложений', percent: 67 },
      { label: 'Просьба о переводе', percent: 50 },
      { label: 'Публичный Wi-Fi', percent: 50 },
    ])
  })
})

describe('sameHost', () => {
  it('принимает origin или referer страницы и отклоняет остальное', () => {
    expect(sameHost('http://museum.test', null, 'museum.test')).toBe(true)
    expect(sameHost(null, 'http://museum.test/scene/1', 'museum.test')).toBe(true)
    expect(sameHost('http://evil.test', null, 'museum.test')).toBe(false)
    expect(sameHost(null, null, 'museum.test')).toBe(false)
    expect(sameHost('http://museum.test', null, null)).toBe(false)
    expect(sameHost('not a url', null, 'museum.test')).toBe(false)
  })
})

describe('limited', () => {
  it('разрешает десять запросов в час и забывает старые', () => {
    const hits = new Map<string, number[]>()
    const now = 10 * 60 * 60 * 1000
    for (let i = 0; i < 10; i += 1) expect(limited(hits, '1.1.1.1', now + i)).toBe(false)
    expect(limited(hits, '1.1.1.1', now + 10)).toBe(true)
    expect(limited(hits, '1.1.1.1', now + 60 * 60 * 1000)).toBe(false)
  })
})
