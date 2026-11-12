import type { CardRepository } from '../domain/CardRepository'
import type { PromoCard } from '../domain/PromoCard'
import { UPCOMING_EVENTS } from './events.data'

/** Adapter: serves hardcoded events until a back office is chosen. */
export class InMemoryEventRepository implements CardRepository {
  constructor(private readonly events: readonly PromoCard[] = UPCOMING_EVENTS) {}

  list(): Promise<PromoCard[]> {
    return Promise.resolve([...this.events])
  }
}
