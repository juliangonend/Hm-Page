import { forwardRef, useId, type SVGProps } from 'react'
import { BALL_CENTER as CENTER, BALL_RADIUS as RADIUS } from './hockeyBallGeometry'

interface HockeyBallProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'width' | 'height' | 'viewBox'> {
  size?: number
}


interface Dimple {
  cx: number
  cy: number
  r: number
  opacity: number
}

/**
 * Dimple layout: concentric rings projected on the sphere. Dimples near the rim are
 * foreshortened (smaller, fainter) so the ball reads as 3D. Computed once at module load.
 */
const DIMPLES: Dimple[] = (() => {
  const rings = [
    { distance: 0, count: 1 },
    { distance: 0.3, count: 7 },
    { distance: 0.56, count: 12 },
    { distance: 0.78, count: 16 },
    { distance: 0.93, count: 20 },
  ]
  return rings.flatMap(({ distance, count }, ringIndex) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + ringIndex * 0.35
      const depth = Math.sqrt(1 - distance * distance)
      return {
        cx: CENTER + Math.cos(angle) * distance * RADIUS,
        cy: CENTER + Math.sin(angle) * distance * RADIUS,
        r: 3.1 * (0.45 + 0.55 * depth),
        opacity: 0.18 + 0.32 * depth,
      }
    }),
  )
})()

/**
 * Realistic field-hockey ball. The forwarded ref targets the root <svg>; the element
 * with `data-ball-spin` is the dimple group, which rotates independently so rolling looks
 * real while the light/shadow stays fixed.
 */
export const HockeyBall = forwardRef<SVGSVGElement, HockeyBallProps>(({ size = 64, ...rest }, ref) => {
  const id = useId().replace(/:/g, '')
  const shade = `ball-shade-${id}`
  const dimple = `ball-dimple-${id}`
  const clip = `ball-clip-${id}`
  const ground = `ball-ground-${id}`

  return (
    <svg
      {...rest}
      ref={ref}
      width={size}
      height={size * 1.12}
      viewBox="0 0 100 112"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={shade} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E9EEF4" />
          <stop offset="100%" stopColor="#BFCAD8" />
        </radialGradient>
        <radialGradient id={dimple} cx="60%" cy="65%" r="60%">
          <stop offset="0%" stopColor="#9FB0C4" />
          <stop offset="100%" stopColor="#C9D3DF" />
        </radialGradient>
        <radialGradient id={ground} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1F3A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clip}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} />
        </clipPath>
      </defs>

      <ellipse cx={CENTER} cy={CENTER + RADIUS + 9} rx={RADIUS * 0.85} ry={5} fill={`url(#${ground})`} />
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={`url(#${shade})`} />

      <g clipPath={`url(#${clip})`}>
        <g data-ball-spin style={{ transformOrigin: `${CENTER}px ${CENTER}px`, transformBox: 'view-box' }}>
          {DIMPLES.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={`url(#${dimple})`} opacity={d.opacity} />
          ))}
        </g>
      </g>

      {/* Fixed lighting over the spinning dimples */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#AEBBCB" strokeWidth="0.8" />
      <ellipse cx={36} cy={32} rx={11} ry={7} fill="#FFFFFF" opacity="0.75" transform="rotate(-30 36 32)" />
      <circle cx={CENTER} cy={CENTER} r={RADIUS - 2} fill="none" stroke="#0B1F3A" strokeOpacity="0.07" strokeWidth="4" />
    </svg>
  )
})

HockeyBall.displayName = 'HockeyBall'

