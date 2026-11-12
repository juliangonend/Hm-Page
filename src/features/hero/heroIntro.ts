import { markIntroDone, type GsapSetupContext } from '../../shared/motion'
import { rollRotation } from '../../shared/ui/hockeyBallGeometry'

export const HERO_BALL_SIZE = 44
/** The logo is split into LOGO_GRID × LOGO_GRID tiles that assemble on impact. */
export const LOGO_GRID = 6

const q = <T extends Element = HTMLElement>(scope: Element, selector: string) =>
  Array.from(scope.querySelectorAll<T>(selector))

/** Deterministic pseudo-random in [-1, 1] so the scatter looks organic but is stable. */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/**
 * Hero intro on the tactical board (~3.6s):
 *  0.0–0.9s  field lines and the play are drawn in chalk (full-screen board, dimmed)
 *  0.5–1.3s  a chalk sketch of the logo (circle + wave) is drawn
 *  1.1–1.7s  the hockey ball rolls in from the left and hits the logo
 *  1.7–2.7s  on impact the real logo tiles fly in and assemble; the sketch fades out
 *  2.7–3.6s  "SE JUEGA COMO SE ENTRENA" is written in chalk, stick underline, CTAs
 */
export const playHeroIntro = ({ gsap, reduced, scope }: GsapSetupContext) => {
  const tiles = q(scope, '[data-logo-tile]')
  const letters = q(scope, '[data-chalk-letter]')
  const ctas = q(scope, '[data-hero-cta]')
  const underline = scope.querySelector<HTMLElement>('[data-hero-underline]')
  const ball = scope.querySelector<SVGSVGElement>('[data-hero-ball]')

  if (reduced) {
    gsap.set(ball, { opacity: 0 })
    gsap.from([scope.querySelector('[data-logo]'), scope.querySelector('[data-chalk-line]'), underline, ...ctas], {
      opacity: 0,
      duration: 0.2,
    })
    markIntroDone()
    return
  }

  const fieldGroup = scope.querySelector('[data-board-field-group]')
  const fieldLines = q<SVGGeometryElement>(scope, '[data-board-field]')
  const arrow = q<SVGGeometryElement>(scope, '[data-board-arrow]')
  const markers = q<SVGGElement>(scope, '[data-board-marker]')
  const sketch = scope.querySelector('[data-logo-sketch]')
  const sketchLines = q<SVGGeometryElement>(scope, '[data-sketch-line]')
  const logo = scope.querySelector<HTMLElement>('[data-logo]')
  const logoWrap = scope.querySelector<HTMLElement>('[data-logo-wrap]')
  const ballSpin = ball?.querySelector('[data-ball-spin]')
  const chalkLine = scope.querySelector<HTMLElement>('[data-chalk-line]')

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // Board: field lines, play arrow and markers in chalk
  tl.set(fieldGroup, { opacity: 0.5 }, 0)
  tl.fromTo(
    fieldLines,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut', stagger: 0.12 },
    0,
  )
  tl.to(fieldGroup, { opacity: 0.18, duration: 0.4 }, 0.8)
  tl.fromTo(
    arrow,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut', stagger: 0.35 },
    0.4,
  )
  tl.from(markers, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(2)', stagger: 0.06 }, 0.5)

  // Chalk sketch of the logo
  tl.fromTo(
    sketchLines,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.2 },
    0.5,
  )

  // Tiles start scattered and invisible
  tiles.forEach((tile, i) => {
    gsap.set(tile, {
      x: jitter(i, 1) * 260,
      y: jitter(i, 2) * 220 - 60,
      rotation: jitter(i, 3) * 70,
      scale: 0.55,
      opacity: 0,
    })
  })

  // Ball rolls in from the left edge of the screen to the bottom of the logo
  const IMPACT = 1.7
  if (ball && logoWrap) {
    const travel = { d: 0 }
    const startX = -(logoWrap.getBoundingClientRect().left + HERO_BALL_SIZE * 2)
    const endX = logoWrap.clientWidth * 0.3
    const place = () => {
      gsap.set(ball, { x: startX + (endX - startX) * travel.d })
      if (ballSpin) gsap.set(ballSpin, { rotation: rollRotation((endX - startX) * travel.d, HERO_BALL_SIZE) })
    }
    place()
    tl.set(ball, { opacity: 1 }, 1.1)
    tl.to(travel, { d: 1, duration: IMPACT - 1.1, ease: 'power1.in', onUpdate: place }, 1.1)
    // Impact: small bounce back, then the ball rolls away under the logo and fades
    tl.to(ball, { x: endX - 30, y: -18, duration: 0.18, ease: 'power2.out' }, IMPACT)
    tl.to(ball, { y: 0, duration: 0.22, ease: 'bounce.out' }, IMPACT + 0.18)
    tl.to(ball, { opacity: 0, duration: 0.3 }, IMPACT + 0.5)
  }

  // Impact: the real logo assembles from its tiles
  tl.to(
    tiles,
    {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: { amount: 0.45, from: 'center', grid: [LOGO_GRID, LOGO_GRID] },
    },
    IMPACT,
  )
  tl.to(sketch, { opacity: 0, duration: 0.5 }, IMPACT + 0.5)
  tl.fromTo(logo, { scale: 1 }, { scale: 1.04, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.inOut' }, IMPACT + 1.0)

  // Tagline written in chalk, letter by letter
  const TAGLINE_AT = 2.7
  tl.set(chalkLine, { opacity: 1, filter: 'url(#hero-chalk)' }, TAGLINE_AT)
  tl.fromTo(
    letters,
    { clipPath: 'inset(-10% 100% -10% 0)', opacity: 0.6 },
    { clipPath: 'inset(-10% 0% -10% 0)', opacity: 1, duration: 0.1, ease: 'power1.inOut', stagger: 0.04 },
    TAGLINE_AT,
  )
  tl.set(chalkLine, { filter: 'none' }, '>')
  tl.fromTo(underline, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'center center', duration: 0.4 }, '>-0.1')
  tl.from(ctas, { y: 16, opacity: 0, duration: 0.35, stagger: 0.08 }, '>-0.1')

  // The navbar waits for this to slide in
  tl.call(markIntroDone)
}
