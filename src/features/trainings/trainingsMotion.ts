import type { GsapSetupContext } from '../../shared/motion'
import { rollRotation } from '../../shared/ui/hockeyBallGeometry'

export const TRAINING_BALL_SIZE = 44
const BALL_DURATION = 1.3
const CARD_STAGGER = 0.15
const CARD_DROP = 0.9
/** Extra wait (s) before the first card drops, so the ball gets ahead of the cards. */
const CARD_DELAY = 0.5

/** Ball rolls under the grid while cards bounce into place; afterwards a scrubbed parallax. */
export const playTrainingsMotion = ({ gsap, reduced, scope }: GsapSetupContext) => {
  const grid = scope.querySelector<HTMLElement>('[data-training-grid]')
  const shells = Array.from(scope.querySelectorAll<HTMLElement>('[data-training-shell]'))
  const cards = shells.map((shell) => shell.querySelector<HTMLElement>('[data-training-card]'))
  const track = scope.querySelector<HTMLElement>('[data-ball-track]')
  const ball = scope.querySelector<SVGSVGElement>('[data-training-ball]')
  const spin = ball?.querySelector('[data-ball-spin]')
  const trail = scope.querySelector<HTMLElement>('[data-ball-trail]')
  if (!grid) return

  const scrollTrigger = { trigger: grid, start: 'top 78%', once: true }

  if (reduced) {
    gsap.from(cards, { opacity: 0, duration: 0.2, scrollTrigger })
    return
  }

  const tl = gsap.timeline({ scrollTrigger })

  if (track && ball) {
    const distance = () => track.clientWidth - TRAINING_BALL_SIZE
    tl.fromTo(ball, { x: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0)
    tl.to(ball, { x: distance, duration: BALL_DURATION, ease: 'power1.inOut' }, 0)
    if (spin) {
      tl.fromTo(
        spin,
        { rotation: 0 },
        { rotation: () => rollRotation(distance(), TRAINING_BALL_SIZE), duration: BALL_DURATION, ease: 'power1.inOut' },
        0,
      )
    }
    if (trail) tl.fromTo(trail, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: BALL_DURATION, ease: 'power1.inOut' }, 0)
  }

  cards.forEach((card, index) => {
    if (!card) return
    const start = 0.1 + CARD_DELAY + index * CARD_STAGGER
    tl.fromTo(
      card,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: CARD_DROP, ease: 'bounce.out', clearProps: 'transform' },
      start,
    )
    const details = card.querySelectorAll('[data-training-detail]')
    tl.from(details, { y: 14, opacity: 0, duration: 0.35, ease: 'power2.out', stagger: 0.06 }, start + CARD_DROP)
  })

  shells.forEach((shell, index) => {
    const offset = index % 2 === 0 ? 16 : -16
    gsap.fromTo(
      shell,
      { y: offset },
      { y: -offset, ease: 'none', scrollTrigger: { trigger: shell, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  })
}
