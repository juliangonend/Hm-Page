import { describe, expect, it, vi } from 'vitest'
import { HttpEventRepository } from './HttpEventRepository'

const apiEvents = [
  {
    id: 1,
    title: 'Campus de verano',
    subtitle: 'Arqueros y jugadores',
    venue: 'Club Alemán, Mendoza',
    country: 'ES',
    description: 'Tres días',
    date: '2027-02-10T09:00:00-03:00',
    endDate: '2027-02-12',
    link: 'https://example.com/inscripcion',
    price: '45000.00',
    currency: 'ARS',
    imageUrl: '/uploads/events/event-1.webp',
    published: true,
  },
  {
    id: 2,
    title: 'Clínica',
    subtitle: null,
    venue: null,
    description: 'Gratis',
    date: '2027-03-01T18:00:00-03:00',
    endDate: null,
    link: null,
    price: null,
    currency: 'ARS',
    imageUrl: null,
    published: true,
  },
]

describe('HttpEventRepository', () => {
  it('maps the public API events into cards, keeping the API order', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify(apiEvents), { status: 200 }))
    const cards = await new HttpEventRepository('/api', fetchFn).list()

    expect(fetchFn).toHaveBeenCalledWith('/api/events')
    expect(cards[0]).toMatchObject({
      id: '1',
      title: 'Campus de verano',
      subtitle: 'Arqueros y jugadores',
      venue: 'Club Alemán, Mendoza',
      country: 'ES',
      imageUrl: '/uploads/events/event-1.webp',
      startsAt: '2027-02-10',
      endsAt: '2027-02-12',
      ctaLabel: 'Inscribirme',
      ctaUrl: 'https://example.com/inscripcion',
      published: true,
      order: 0,
    })
    expect(cards[0].priceLabel).toMatch(/45\.000/)
    expect(cards[1]).toMatchObject({ id: '2', order: 1 })
    expect(cards[1].priceLabel).toBeUndefined()
    expect(cards[1].subtitle).toBeUndefined()
    expect(cards[1].venue).toBeUndefined()
    expect(cards[1].endsAt).toBeUndefined()
    expect(cards[0]).not.toHaveProperty('time')
    // Events saved before the country existed count as Argentina
    expect(cards[1].country).toBe('AR')
    expect(cards[1].ctaUrl).toBeUndefined()
    expect(cards[1].imageUrl).toBeUndefined()
  })

  it('fails when the API answers with an error, so the section shows its fallback', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }))
    await expect(new HttpEventRepository('/api', fetchFn).list()).rejects.toThrow()
  })
})
