import { describe, expect, it } from 'vitest'
import { fillWall } from './fillWall'
import type { TrustedClub } from './TrustedClub'

const club = (id: string): TrustedClub => ({ id, name: `Club ${id}`, logo: `clubs/${id}.png` })

describe('fillWall', () => {
  it('repeats the clubs in order until the wall has the requested number of tiles', () => {
    const wall = fillWall([club('a'), club('b')], 5)
    expect(wall.map((tile) => tile.club.id)).toEqual(['a', 'b', 'a', 'b', 'a'])
  })

  it('marks only the first appearance of each club as primary (the rest are decorative)', () => {
    const wall = fillWall([club('a'), club('b')], 4)
    expect(wall.map((tile) => tile.primary)).toEqual([true, true, false, false])
  })

  it('gives every tile a unique key', () => {
    const wall = fillWall([club('a')], 3)
    expect(new Set(wall.map((tile) => tile.key)).size).toBe(3)
  })

  it('never cuts the list when there are more clubs than tiles', () => {
    const wall = fillWall([club('a'), club('b'), club('c')], 2)
    expect(wall).toHaveLength(3)
  })

  it('returns an empty wall when there are no clubs', () => {
    expect(fillWall([], 10)).toEqual([])
  })
})
