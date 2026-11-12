import type { PromoCard } from './PromoCard'

/** Keeps only published cards, ordered by `order` ascending. Pure: never mutates the input. */
export const selectPublishedCards = (cards: readonly PromoCard[]): PromoCard[] =>
  cards.filter((card) => card.published).sort((a, b) => a.order - b.order)
