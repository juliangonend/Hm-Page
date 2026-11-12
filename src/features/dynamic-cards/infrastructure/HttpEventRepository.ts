import type { CardRepository } from '../domain/CardRepository'
import type { PromoCard } from '../domain/PromoCard'

/** Public event as served by GET /api/events. */
interface ApiEvent {
  id: number
  title: string
  subtitle: string | null
  venue: string | null
  description: string
  date: string
  link: string | null
  price: string | null
  currency: string
  imageUrl: string | null
  published: boolean
}

type FetchFn = (input: string) => Promise<Response>

const formatPrice = (price: string, currency: string): string => {
  const amount = Number(price)
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

const toCard = (event: ApiEvent, index: number): PromoCard => ({
  id: String(event.id),
  category: 'novedad',
  title: event.title,
  subtitle: event.subtitle ?? undefined,
  venue: event.venue ?? undefined,
  description: event.description,
  imageUrl: event.imageUrl ?? undefined,
  priceLabel: event.price === null ? undefined : formatPrice(event.price, event.currency),
  // Label of the registration link inside the "+ info" detail
  ctaLabel: 'Inscribirme',
  ctaUrl: event.link ?? undefined,
  // The API already sends the date in the event's own time zone: slice, don't convert
  startsAt: event.date.slice(0, 10),
  time: event.date.slice(11, 16),
  published: event.published,
  // The API returns upcoming events soonest first: keep that order
  order: index,
})

/** Adapter: upcoming events from the PHP back office (Hostinger). */
export class HttpEventRepository implements CardRepository {
  constructor(
    private readonly base: string,
    private readonly fetchFn: FetchFn = (input) => fetch(input),
  ) {}

  async list(): Promise<PromoCard[]> {
    const response = await this.fetchFn(`${this.base}/events`)
    if (!response.ok) throw new Error(`Events API answered ${response.status}`)
    const events = (await response.json()) as ApiEvent[]
    return events.map(toCard)
  }
}
