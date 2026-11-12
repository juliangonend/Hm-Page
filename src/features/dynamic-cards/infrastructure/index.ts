import type { CardRepository } from '../domain/CardRepository'
import { API_BASE, hasApi } from '../../../shared/api/apiBase'
import { HttpEventRepository } from './HttpEventRepository'
import { InMemoryEventRepository } from './InMemoryEventRepository'

/**
 * Composition root for upcoming events (dynamic cards).
 * Builds with VITE_API_URL (Hostinger) read the PHP back office; any other build uses the in-memory sample data.
 */
export const createCardRepository = (): CardRepository =>
  hasApi() ? new HttpEventRepository(API_BASE) : new InMemoryEventRepository()

export const cardRepository: CardRepository = createCardRepository()
