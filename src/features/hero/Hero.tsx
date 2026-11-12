import { useRef, type CSSProperties } from 'react'
import { TacticalBoard } from './TacticalBoard'
import { HERO_BALL_SIZE, LOGO_GRID, playHeroIntro } from './heroIntro'
import { Button } from '../../shared/ui/Button'
import { HockeyBall } from '../../shared/ui/HockeyBall'
import { useGsap } from '../../shared/motion'
import { asset } from '../../shared/lib/asset'
import { useContactModal } from '../contact/application/contactModalContext'
import styles from './Hero.module.css'

const TAGLINE_WORDS = ['SE', 'JUEGA', 'COMO', 'SE', 'ENTRENA']
const LOGO_SRC = asset('logos.png')

const tiles = Array.from({ length: LOGO_GRID * LOGO_GRID }, (_, i) => ({
  col: i % LOGO_GRID,
  row: Math.floor(i / LOGO_GRID),
}))

export const Hero = () => {
  const ref = useRef<HTMLElement>(null)
  const { openContact } = useContactModal()
  useGsap(ref, playHeroIntro)

  return (
    <section ref={ref} id="top" className={styles.hero} aria-labelledby="hero-title">
      {/* Chalk texture filter used while strokes and letters are being "written" */}
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <filter id="hero-chalk" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={styles.boardWrap} aria-hidden="true">
        <TacticalBoard />
      </div>

      <div className={styles.center}>
        <h1 id="hero-title" className={styles.logoWrap} data-logo-wrap>
          <span className={styles.srOnly}>Hockey Management</span>

          {/* Chalk sketch of the logo, drawn before the pieces assemble */}
          <svg className={styles.sketch} viewBox="0 0 1080 1036" aria-hidden="true" focusable="false" data-logo-sketch>
            <g fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" filter="url(#hero-chalk)">
              <circle data-sketch-line cx="539" cy="512" r="488" pathLength={1} />
              <path
                data-sketch-line
                d="M180 175 C 330 290, 460 360, 575 390 C 560 250, 640 140, 760 140 C 880 140, 990 260, 1010 420 C 1030 640, 900 860, 700 870 C 480 880, 260 700, 100 410"
                pathLength={1}
              />
            </g>
          </svg>

          {/* The real logo (public/logos.png), split into tiles that fly in and assemble */}
          <span className={styles.logo} aria-hidden="true" data-logo>
            {tiles.map(({ col, row }) => (
              <span
                key={`${row}-${col}`}
                className={styles.tile}
                data-logo-tile
                style={
                  {
                    '--col': col,
                    '--row': row,
                    '--grid': LOGO_GRID,
                    backgroundImage: `url(${LOGO_SRC})`,
                  } as CSSProperties
                }
              />
            ))}
          </span>

          <HockeyBall size={HERO_BALL_SIZE} className={styles.ball} data-hero-ball />
        </h1>

        <p className={styles.tagline} aria-label="Se juega como se entrena" data-chalk-line>
          {TAGLINE_WORDS.map((word, w) => (
            <span key={w} className={styles.word} aria-hidden="true">
              {word.split('').map((letter, i) => (
                <span key={i} className={styles.letter} data-chalk-letter>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </p>
        <span className={styles.underline} data-hero-underline aria-hidden="true" />

        <div className={styles.ctas}>
          <Button data-hero-cta onClick={() => openContact('JUGADORES')}>
            QUIERO ENTRENAR
          </Button>
          <Button
            data-hero-cta
            variant="ghost"
            onClick={() => document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' })}
          >
            SOY UN CLUB
          </Button>
        </div>
      </div>

      <span className={styles.scrollCue} aria-hidden="true" data-hero-cta />
    </section>
  )
}
