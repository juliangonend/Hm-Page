import { useRef, type CSSProperties } from 'react'
import { SectionTitle } from '../../../shared/ui/SectionTitle'
import { Button } from '../../../shared/ui/Button'
import { asset } from '../../../shared/lib/asset'
import { useGsap, type GsapSetupContext } from '../../../shared/motion'
import { fillWall } from './fillWall'
import { scatterLayout, type Depth } from './scatterLayout'
import type { TrustedClub } from './TrustedClub'
import styles from './TrustedClubsWall.module.css'

interface TrustedClubsWallProps {
  clubs: TrustedClub[]
  onRequestProposal?: () => void
}

const LAYOUT = scatterLayout()

/** Scroll parallax per plane: near logos travel more than far ones. */
const PARALLAX: Record<Depth, number> = { far: -30, mid: -80, near: -170 }
const DEPTH_ORDER: Depth[] = ['far', 'mid', 'near']

/** Logos pop in from the background to the foreground, then drift with depth parallax while scrolling. */
const playField = ({ gsap, reduced, scope }: GsapSetupContext) => {
  const byDepth = (depth: Depth) => scope.querySelectorAll(`[data-depth="${depth}"]`)
  const copy = scope.querySelectorAll('[data-field-copy]')

  if (reduced) {
    gsap.from([...scope.querySelectorAll('[data-field-logo]'), ...copy], {
      opacity: 0,
      duration: 0.2,
      scrollTrigger: { trigger: scope, start: 'top 75%', once: true },
    })
    return
  }

  const intro = gsap.timeline({ scrollTrigger: { trigger: scope, start: 'top 70%', once: true } })
  DEPTH_ORDER.forEach((depth, plane) => {
    intro.from(
      byDepth(depth),
      {
        scale: 0,
        opacity: 0,
        rotation: () => gsap.utils.random(-60, 60),
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: { each: 0.025, from: 'random' },
      },
      plane * 0.25,
    )
  })
  intro.from(copy, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 0.5)

  DEPTH_ORDER.forEach((depth) => {
    gsap.to(byDepth(depth), {
      y: PARALLAX[depth],
      ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    })
  })
}

export const TrustedClubsWall = ({ clubs, onRequestProposal }: TrustedClubsWallProps) => {
  const ref = useRef<HTMLElement>(null)
  useGsap(ref, playField)
  if (clubs.length === 0) return null

  const tiles = fillWall(clubs, LAYOUT.length)

  return (
    <section ref={ref} id="clubes-confian" className={styles.section} aria-labelledby="trusted-clubs-title">
      <ul className={styles.field}>
        {tiles.map(({ key, club, primary }, i) => {
          const spot = LAYOUT[i % LAYOUT.length]
          return (
            <li
              key={key}
              className={styles.spot}
              data-depth={spot.depth}
              aria-hidden={primary ? undefined : true}
              style={
                {
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  '--size': `${spot.size}vmin`,
                  '--rotation': `${spot.rotation}deg`,
                } as CSSProperties
              }
            >
              <img
                src={asset(club.logo)}
                alt={primary ? club.name : ''}
                title={club.name}
                className={styles.logo}
                loading="lazy"
                decoding="async"
                data-field-logo
              />
            </li>
          )
        })}
      </ul>

      <div className={styles.copy}>
        <SectionTitle id="trusted-clubs-title" text="Clubes que confían en nosotros" className={styles.title} />
        <p className={styles.lead} data-field-copy>
          Clubes, federaciones y asociaciones que eligen Hockey Management para crecer.
        </p>
        <div data-field-copy>
          <Button variant="light" onClick={onRequestProposal}>
            SOLICITAR PROPUESTA
          </Button>
        </div>
      </div>
    </section>
  )
}
