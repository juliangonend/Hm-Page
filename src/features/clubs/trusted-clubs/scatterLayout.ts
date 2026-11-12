export type Depth = 'far' | 'mid' | 'near'

export interface LogoSpot {
  /** Center position, in % of the section */
  x: number
  y: number
  depth: Depth
  /** Logo size in vmin */
  size: number
  rotation: number
}

/** Ellipse (in %) kept free so the headline, subtitle and CTA stay readable. */
export const CENTER_ZONE = { cx: 50, cy: 52, rx: 30, ry: 26 }

/**
 * Extra margin (in %) around the center zone per depth: the zone tests the logo CENTER,
 * so big near logos need room for their radius or their edges land on the CTA.
 */
export const CLEARANCE: Record<Depth, number> = { far: 0, mid: 5, near: 10 }

export const isInCenterZone = (x: number, y: number, clearance = 0) =>
  ((x - CENTER_ZONE.cx) / (CENTER_ZONE.rx + clearance)) ** 2 +
    ((y - CENTER_ZONE.cy) / (CENTER_ZONE.ry + clearance)) ** 2 <
  1

/** Deterministic pseudo-random in [0, 1). */
const noise = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return v - Math.floor(v)
}

const SIZE_RANGE: Record<Depth, [number, number]> = {
  far: [3.5, 6],
  mid: [7, 10.5],
  near: [13, 19],
}

const pickDepth = (r: number): Depth => (r < 0.5 ? 'far' : r < 0.8 ? 'mid' : 'near')

const COLS = 10
const ROWS = 7

/**
 * Scatters logos over a jittered grid (so they cover the whole screen without clumping),
 * skipping the center zone. Three depth planes: many small far logos, fewer big near ones.
 */
export const scatterLayout = (): LogoSpot[] => {
  const spots: LogoSpot[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col
      const x = ((col + 0.5 + (noise(i, 1) - 0.5) * 0.8) / COLS) * 100
      const y = ((row + 0.5 + (noise(i, 2) - 0.5) * 0.8) / ROWS) * 100
      const depth = pickDepth(noise(i, 3))
      if (isInCenterZone(x, y, CLEARANCE[depth])) continue
      const [min, max] = SIZE_RANGE[depth]
      spots.push({
        x: +x.toFixed(2),
        y: +y.toFixed(2),
        depth,
        size: +(min + noise(i, 4) * (max - min)).toFixed(2),
        rotation: +((noise(i, 5) - 0.5) * 30).toFixed(1),
      })
    }
  }
  return spots
}
