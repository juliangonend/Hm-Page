import type { TrustedClub } from './TrustedClub'

export interface WallTile {
  key: string
  club: TrustedClub
  /** First appearance of the club: the only tile exposed to assistive technology. */
  primary: boolean
}

/** Repeats the clubs in order until the wall has at least `minTiles` tiles (never drops a club). */
export const fillWall = (clubs: TrustedClub[], minTiles: number): WallTile[] => {
  if (clubs.length === 0) return []
  const total = Math.max(minTiles, clubs.length)
  return Array.from({ length: total }, (_, i) => ({
    key: `${clubs[i % clubs.length].id}-${i}`,
    club: clubs[i % clubs.length],
    primary: i < clubs.length,
  }))
}
