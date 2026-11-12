import { describe, expect, it } from 'vitest'
import { InMemoryEventRepository } from './InMemoryEventRepository'
import { UPCOMING_EVENTS } from './events.data'
import type { PromoCard } from '../domain/PromoCard'

const event: PromoCard = {
  id: 'e1',
  category: 'campus',
  title: 'Campus',
  description: 'd',
  ctaLabel: 'Inscribirme',
  published: true,
  order: 1,
}

describe('InMemoryEventRepository', () => {
  it('lists the events it was created with', async () => {
    expect(await new InMemoryEventRepository([event]).list()).toEqual([event])
  })

  it('returns a copy so callers cannot mutate the source', async () => {
    const source = [event]
    const listed = await new InMemoryEventRepository(source).list()
    listed.pop()
    expect(source).toHaveLength(1)
  })

  it('defaults to the hardcoded upcoming events', async () => {
    const listed = await new InMemoryEventRepository().list()
    expect(listed).toEqual(UPCOMING_EVENTS)
    expect(listed.length).toBeGreaterThanOrEqual(3)
  })

  it('hardcoded events have unique ids', () => {
    const ids = UPCOMING_EVENTS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
