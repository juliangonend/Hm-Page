import { forwardRef } from 'react'
import styles from './Hero.module.css'

/**
 * Tactical board drawn over the hero. Elements use `pathLength=1` so GSAP can draw them
 * with stroke-dashoffset 1 → 0. Markup is already in its final state (no-JS friendly).
 *   [data-board-field]  field outline, center line and both D areas
 *   [data-board-arrow]  the play arrow (the ball rolls along `#hero-play-path`)
 *   [data-board-marker] X / O player markers
 */
export const TacticalBoard = forwardRef<SVGSVGElement>((_, ref) => (
  <svg ref={ref} className={styles.board} viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <g data-board-field-group className={styles.fieldGroup} fill="none" stroke="#FFFFFF" strokeWidth="2">
      <rect data-board-field x="20" y="20" width="600" height="360" rx="10" pathLength={1} />
      <path data-board-field d="M320 20 V380" pathLength={1} />
      <path data-board-field d="M20 95 A105 105 0 0 1 20 305" pathLength={1} />
      <path data-board-field d="M620 95 A105 105 0 0 0 620 305" pathLength={1} />
    </g>

    <g fill="none" stroke="#2FA9E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path
        id="hero-play-path"
        data-board-arrow
        d="M110 300 C 210 300, 250 170, 360 175 S 500 250, 548 196"
        pathLength={1}
      />
      <path data-board-arrow d="M526 194 L550 194 L546 218" pathLength={1} />
    </g>

    <g strokeLinecap="round" strokeWidth="4" fill="none">
      <g data-board-marker stroke="#FFFFFF" transform="translate(160 130)">
        <path d="M-10 -10 L10 10 M10 -10 L-10 10" />
      </g>
      <g data-board-marker stroke="#FFFFFF" transform="translate(290 270)">
        <path d="M-10 -10 L10 10 M10 -10 L-10 10" />
      </g>
      <g data-board-marker stroke="#2FA9E3" transform="translate(440 110)">
        <circle r="11" />
      </g>
      <g data-board-marker stroke="#2FA9E3" transform="translate(480 300)">
        <circle r="11" />
      </g>
    </g>
  </svg>
))

TacticalBoard.displayName = 'TacticalBoard'
