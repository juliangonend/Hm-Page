/** Ball geometry in the 100-unit viewBox of <HockeyBall>. */
export const BALL_CENTER = 50
export const BALL_RADIUS = 40

/** Rotation (degrees) so a ball rendered at `size` px rolls `distance` px without sliding. */
export const rollRotation = (distance: number, size: number): number => {
  const diameterPx = size * ((BALL_RADIUS * 2) / 100)
  return (distance / (Math.PI * diameterPx)) * 360
}
