import { useCards } from '../application/useCards'
import type { CardRepository } from '../domain/CardRepository'
import type { PromoCard } from '../domain/PromoCard'
import { DynamicCardsView } from './DynamicCardsView'

interface DynamicCardsProps {
  repository: CardRepository
  onCta: (card: PromoCard) => void
}

/** Container: wires the repository through `useCards` into the presentational view. */
export const DynamicCards = ({ repository, onCta }: DynamicCardsProps) => {
  const { status, cards } = useCards(repository)
  return <DynamicCardsView status={status} cards={cards} onCta={onCta} />
}
