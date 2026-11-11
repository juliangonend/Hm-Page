import type { PromoCard } from './PromoCard'

/** Port: any back office (static JSON, Supabase, Sanity, Sheets...) implements this. */
export interface CardRepository {
  list(): Promise<PromoCard[]>
}
