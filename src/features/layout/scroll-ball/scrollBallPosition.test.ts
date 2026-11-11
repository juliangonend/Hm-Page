import { describe, expect, it } from 'vitest'
import { scrollBallPosition } from './scrollBallPosition'
import { rollRotation } from '../../../shared/ui/hockeyBallGeometry'

const base = { scrollHeight: 5000, viewportHeight: 1000, trackLength: 800, ballSize: 24 }

describe('scrollBallPosition', () => {
  it('starts at the top of the track with no rotation', () => {
    expect(scrollBallPosition({ ...base, scrollY: 0 })).toEqual({ progress: 0, offset: 0, rotation: 0 })
  })

  it('reaches the end of the track (minus the ball) at the bottom of the page', () => {
    const { progress, offset } = scrollBallPosition({ ...base, scrollY: 4000 })
    expect(progress).toBe(1)
    expect(offset).toBe(776)
  })

  it('moves proportionally in between', () => {
    expect(scrollBallPosition({ ...base, scrollY: 2000 }).offset).toBe(388)
  })

  it('rolls without sliding: rotation matches the distance travelled', () => {
    const { offset, rotation } = scrollBallPosition({ ...base, scrollY: 1000 })
    expect(rotation).toBeCloseTo(rollRotation(offset, base.ballSize))
  })

  it('clamps overscroll (iOS bounce) to the track', () => {
    expect(scrollBallPosition({ ...base, scrollY: -120 }).offset).toBe(0)
    expect(scrollBallPosition({ ...base, scrollY: 4300 }).offset).toBe(776)
  })

  it('stays at the top when the page does not scroll', () => {
    expect(scrollBallPosition({ ...base, scrollHeight: 900, scrollY: 0 }).progress).toBe(0)
  })
})
