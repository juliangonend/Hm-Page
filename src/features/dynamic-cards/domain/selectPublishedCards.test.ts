import { describe, expect, it } from 'vitest'
import { selectPublishedCards } from './selectPublishedCards'
import type { PromoCard } from './PromoCard'

const card = (overrides: Partial<PromoCard>): PromoCard => ({
  id: 'x',
  category: 'campus',
  title: 'Title',
  description: 'Description',
  ctaLabel: 'Ver más',
  published: true,
  order: 0,
  ...overrides,
})

describe('selectPublishedCards', () => {
  it('drops unpublished cards', () => {
    const result = selectPublishedCards([
      card({ id: 'a', published: true }),
      card({ id: 'b', published: false }),
    ])
    expect(result.map((c) => c.id)).toEqual(['a'])
  })

  it('sorts by order ascending', () => {
    const result = selectPublishedCards([
      card({ id: 'c', order: 3 }),
      card({ id: 'a', order: 1 }),
      card({ id: 'b', order: 2 }),
    ])
    expect(result.map((c) => c.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input array', () => {
    const input = [card({ id: 'b', order: 2 }), card({ id: 'a', order: 1 })]
    selectPublishedCards(input)
    expect(input.map((c) => c.id)).toEqual(['b', 'a'])
  })

  it('returns an empty list when nothing is published', () => {
    expect(selectPublishedCards([card({ published: false })])).toEqual([])
  })
})
