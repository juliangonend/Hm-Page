import { useRef } from 'react'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import { Button } from '../../shared/ui/Button'
import { asset } from '../../shared/lib/asset'
import { revealUp, useGsap, type GsapSetupContext } from '../../shared/motion'
import { useContactModal } from '../contact/application/contactModalContext'
import styles from './ClubsSection.module.css'

const SERVICES = [
  {
    title: 'Asesoramiento',
    text: 'Brindamos las herramientas necesarias para tu club, federación o asociación. Planificamos, organizamos y fortalecemos la institución, capacitando al personal para alcanzar los objetivos propuestos.',
  },
  {
    title: 'Giras Deportivas',
    text: 'Nos encargamos de organizar giras deportivas integrales para tu institución, con partidos, actividades, comidas, alojamiento y más. Diseñadas para que solo se dediquen a disfrutar, y adaptadas a cualquier presupuesto y necesidad.',
  },
]

const DESKTOP = '(min-width: 992px) and (prefers-reduced-motion: no-preference)'

const playClubsMotion = (ctx: GsapSetupContext) => {
  const { gsap, scope } = ctx
  const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-club-row]'))
  const path = scope.querySelectorAll('[data-club-path]')
  const image = scope.querySelector('[data-club-image]')
  const setActive = (index: number) =>
    rows.forEach((row, i) => row.classList.toggle(styles.rowActive, i === index))

  const mm = gsap.matchMedia()

  mm.add(DESKTOP, () => {
    scope.classList.add(styles.pinned)
    setActive(0)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => setActive(self.progress < 0.5 ? 0 : 1),
      },
    })
    tl.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1, stagger: 0.1 }, 0)
    tl.fromTo(image, { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0)
    return () => {
      scope.classList.remove(styles.pinned)
      rows.forEach((row) => row.classList.remove(styles.rowActive))
    }
  })

  // Mobile and reduced motion: the rows stay visible as plain content (no scroll reveal)

  return () => mm.revert()
}

export const ClubsSection = () => {
  const ref = useRef<HTMLElement>(null)
  const { openContact } = useContactModal()

  useGsap(ref, (ctx) => {
    revealUp(ctx, ctx.scope.querySelectorAll('[data-reveal]'), ctx.scope)
    return playClubsMotion(ctx)
  })

  return (
    <section ref={ref} id="teams" className={`section ${styles.section}`} aria-labelledby="clubs-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={`eyebrow ${styles.eyebrow}`} data-reveal>
            PARA CLUBES
          </span>
          <SectionTitle id="clubs-title" text="Potenciamos tu club" className={styles.title} />
          <p className={styles.lead} data-reveal>
            Propuestas flexibles, presenciales y online, adaptadas a tu presupuesto. Contratalas de forma integral o por
            separado.
          </p>

          <ol className={styles.rows}>
            {SERVICES.map((service, index) => (
              <li key={service.title} className={styles.row} data-club-row>
                <span className={styles.index} aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3 className={styles.rowTitle}>{service.title}</h3>
                  <p className={styles.rowText}>{service.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal>
            <Button variant="light" onClick={() => openContact('ASESORAMIENTO')}>
              SOLICITAR PROPUESTA
            </Button>
          </div>
        </div>

        <div className={styles.media}>
          <img
            src={asset('club-foto.webp')}
            alt="Entrenador de Hockey Management dando indicaciones a un plantel de hockey en la cancha"
            className={styles.image}
            loading="lazy"
            data-club-image
          />
          <svg className={styles.play} viewBox="0 0 400 500" aria-hidden="true" focusable="false">
            <g fill="none" stroke="#2FA9E3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path data-club-path d="M60 440 C 120 360, 80 280, 180 240 S 320 180, 300 70" pathLength={1} />
              <path data-club-path d="M280 82 L300 62 L318 86" pathLength={1} />
            </g>
            <g stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round">
              <circle cx="60" cy="440" r="12" />
              <path d="M170 228 l20 20 m0 -20 l-20 20" />

            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
