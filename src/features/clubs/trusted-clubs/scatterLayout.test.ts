import { describe, expect, it } from 'vitest'
import { CENTER_ZONE, isInCenterZone, scatterLayout } from './scatterLayout'

describe('scatterLayout', () => {
  const layout = scatterLayout()

  it('places a crowd of logos (enough to fill the screen)', () => {
    expect(layout.length).toBeGreaterThanOrEqual(30)
  })

  it('keeps the center free for the headline', () => {
    expect(layout.some((spot) => isInCenterZone(spot.x, spot.y))).toBe(false)
  })

  it('keeps every logo inside the section', () => {
    for (const spot of layout) {
      expect(spot.x).toBeGreaterThanOrEqual(0)
      expect(spot.x).toBeLessThanOrEqual(100)
      expect(spot.y).toBeGreaterThanOrEqual(0)
      expect(spot.y).toBeLessThanOrEqual(100)
    }
  })

  it('uses three depth planes, with more logos far away than near', () => {
    const count = (depth: string) => layout.filter((spot) => spot.depth === depth).length
    expect(count('near')).toBeGreaterThan(0)
    expect(count('mid')).toBeGreaterThan(0)
    expect(count('far')).toBeGreaterThan(count('near'))
  })

  it('makes near logos bigger than far ones', () => {
    const near = layout.filter((s) => s.depth === 'near').map((s) => s.size)
    const far = layout.filter((s) => s.depth === 'far').map((s) => s.size)
    expect(Math.min(...near)).toBeGreaterThan(Math.max(...far))
  })

  it('is deterministic (same layout on every render)', () => {
    expect(scatterLayout()).toEqual(layout)
  })

  it('treats the exact center as part of the center zone', () => {
    expect(isInCenterZone(CENTER_ZONE.cx, CENTER_ZONE.cy)).toBe(true)
    expect(isInCenterZone(2, 2)).toBe(false)
  })
})
