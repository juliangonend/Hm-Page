import type { CardRepository } from '../domain/CardRepository'
import { InMemoryEventRepository } from './InMemoryEventRepository'

/**
 * Composition root for upcoming events (dynamic cards).
 *
 * This is the ONLY place to change when the back office is chosen:
 * implement `CardRepository` in a new adapter inside this folder
 * (e.g. SupabaseEventRepository, SanityEventRepository, SheetsEventRepository)
 * and return it here. Nothing else in the app needs to change.
 */
export const createCardRepository = (): CardRepository => new InMemoryEventRepository()

export const cardRepository: CardRepository = createCardRepository()
