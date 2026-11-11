import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCards } from './useCards'
import type { CardRepository } from '../domain/CardRepository'
import type { PromoCard } from '../domain/PromoCard'

const sample: PromoCard[] = [
  { id: 'b', category: 'gira', title: 'B', description: 'd', ctaLabel: 'x', published: true, order: 2 },
  { id: 'a', category: 'campus', title: 'A', description: 'd', ctaLabel: 'x', published: true, order: 1 },
  { id: 'h', category: 'novedad', title: 'H', description: 'd', ctaLabel: 'x', published: false, order: 0 },
]

const repo = (list: CardRepository['list']): CardRepository => ({ list })

describe('useCards', () => {
  it('starts loading and then exposes published cards sorted by order', async () => {
    const repository = repo(() => Promise.resolve(sample))
    const { result } = renderHook(() => useCards(repository))
    expect(result.current.status).toBe('loading')
    expect(result.current.cards).toEqual([])

    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.cards.map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('reports empty when no published cards exist', async () => {
    const repository = repo(() => Promise.resolve([sample[2]]))
    const { result } = renderHook(() => useCards(repository))
    await waitFor(() => expect(result.current.status).toBe('empty'))
    expect(result.current.cards).toEqual([])
  })

  it('reports error when the repository rejects', async () => {
    const repository = repo(() => Promise.reject(new Error('boom')))
    const { result } = renderHook(() => useCards(repository))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.cards).toEqual([])
  })
})
