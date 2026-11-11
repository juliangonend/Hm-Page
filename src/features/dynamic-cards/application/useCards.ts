import { useEffect, useState } from 'react'
import type { CardRepository } from '../domain/CardRepository'
import type { PromoCard } from '../domain/PromoCard'
import { selectPublishedCards } from '../domain/selectPublishedCards'

export type CardsStatus = 'loading' | 'ready' | 'empty' | 'error'

export interface CardsState {
  status: CardsStatus
  cards: PromoCard[]
}

export const useCards = (repository: CardRepository): CardsState => {
  const [state, setState] = useState<CardsState>({ status: 'loading', cards: [] })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', cards: [] })

    repository
      .list()
      .then((raw) => {
        if (cancelled) return
        const cards = selectPublishedCards(raw)
        setState({ status: cards.length > 0 ? 'ready' : 'empty', cards })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', cards: [] })
      })

    return () => {
      cancelled = true
    }
  }, [repository])

  return state
}
