import { rollRotation } from '../../../shared/ui/hockeyBallGeometry'

interface ScrollBallInput {
  scrollY: number
  scrollHeight: number
  viewportHeight: number
  /** Length (px) of the track the ball rolls along */
  trackLength: number
  ballSize: number
}

export interface ScrollBallPosition {
  /** Page scroll progress in [0, 1] */
  progress: number
  /** Distance (px) from the top of the track */
  offset: number
  /** Ball spin (deg) so it rolls without sliding */
  rotation: number
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const scrollBallPosition = ({
  scrollY,
  scrollHeight,
  viewportHeight,
  trackLength,
  ballSize,
}: ScrollBallInput): ScrollBallPosition => {
  const scrollable = scrollHeight - viewportHeight
  const progress = scrollable > 0 ? clamp01(scrollY / scrollable) : 0
  const offset = progress * Math.max(0, trackLength - ballSize)
  return { progress, offset, rotation: offset === 0 ? 0 : rollRotation(offset, ballSize) }
}
