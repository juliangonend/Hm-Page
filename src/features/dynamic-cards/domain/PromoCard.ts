export const PROMO_CARD_CATEGORIES = ['campus', 'gira', 'entrenamiento', 'novedad'] as const

export type PromoCardCategory = (typeof PROMO_CARD_CATEGORIES)[number]

export interface PromoCard {
  id: string
  category: PromoCardCategory
  title: string
  description: string
  imageUrl?: string
  badge?: string
  ctaLabel: string
  ctaUrl?: string
  spotsLeft?: number
  /** ISO 8601 date string. */
  startsAt?: string
  published: boolean
  order: number
}
