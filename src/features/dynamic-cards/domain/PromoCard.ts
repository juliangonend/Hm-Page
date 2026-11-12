import type { CountryCode } from '../../../shared/domain/countries'

export const PROMO_CARD_CATEGORIES = ['campus', 'gira', 'entrenamiento', 'novedad'] as const

export type PromoCardCategory = (typeof PROMO_CARD_CATEGORIES)[number]

export interface PromoCard {
  id: string
  category: PromoCardCategory
  title: string
  /** Short line under the title */
  subtitle?: string
  /** Venue, shown as a sign on the card photo */
  venue?: string
  /** Country it happens in: drives the flag and the WhatsApp line for questions */
  country?: CountryCode
  /** Full text, shown in the "+ info" detail (line breaks preserved) */
  description: string
  imageUrl?: string
  badge?: string
  ctaLabel: string
  ctaUrl?: string
  spotsLeft?: number
  /** First day, "YYYY-MM-DD" */
  startsAt?: string
  /** Last day of a multi-day event, "YYYY-MM-DD" */
  endsAt?: string
  /** Ready-to-show price, e.g. "$ 45.000" */
  priceLabel?: string
  published: boolean
  order: number
}
