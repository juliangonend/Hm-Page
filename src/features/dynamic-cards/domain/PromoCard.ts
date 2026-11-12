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
  /** Full text, shown in the "+ info" detail (line breaks preserved) */
  description: string
  imageUrl?: string
  badge?: string
  ctaLabel: string
  ctaUrl?: string
  spotsLeft?: number
  /** ISO 8601 date string. */
  startsAt?: string
  /** Start time "HH:mm", in the event's own time zone */
  time?: string
  /** Ready-to-show price, e.g. "$ 45.000" */
  priceLabel?: string
  published: boolean
  order: number
}
