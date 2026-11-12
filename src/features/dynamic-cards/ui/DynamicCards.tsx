import { useCards } from '../application/useCards'
import type { CardRepository } from '../domain/CardRepository'
import { DynamicCardsView } from './DynamicCardsView'

interface DynamicCardsProps {
  repository: CardRepository
}

/** Container: wires the repository through `useCards` into the presentational view. */
export const DynamicCards = ({ repository }: DynamicCardsProps) => {
  const { status, cards } = useCards(repository)
  return <DynamicCardsView status={status} cards={cards} />
}
