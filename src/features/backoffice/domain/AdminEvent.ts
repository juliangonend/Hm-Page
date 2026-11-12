import type { CountryCode } from '../../../shared/domain/countries'

/** Event as returned by the back office API. */
export interface AdminEvent {
  id: number
  title: string
  subtitle: string | null
  /** Venue shown as a sign on the card, e.g. "Club Alemán, Mendoza" */
  venue: string | null
  country: CountryCode
  description: string
  /** ISO 8601 with offset, e.g. "2027-02-10T09:00:00-03:00" */
  date: string
  link: string | null
  /** Decimal string ("45000.00") or null when the event has no price */
  price: string | null
  currency: string
  imageUrl: string | null
  published: boolean
}

/** Body accepted by POST/PUT /admin/events. */
export interface EventPayload {
  title: string
  subtitle: string
  venue: string
  country: CountryCode
  description: string
  /** datetime-local value, "2027-02-10T09:00" */
  date: string
  link: string
  price: string
  currency: string
  published: boolean
}
