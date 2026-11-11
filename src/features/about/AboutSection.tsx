import { useRef } from 'react'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import { Button } from '../../shared/ui/Button'
import { asset } from '../../shared/lib/asset'
import { revealUp, useGsap } from '../../shared/motion'
import { useContactModal } from '../contact/application/contactModalContext'
import styles from './AboutSection.module.css'

const PILLS = ['Grupos reducidos', 'Todas las edades', 'Presencial y online']

export const AboutSection = () => {
  const ref = useRef<HTMLElement>(null)
  const { openContact } = useContactModal()

  useGsap(ref, (ctx) => {
    revealUp(ctx, ctx.scope.querySelectorAll('[data-reveal]'), ctx.scope)
    if (!ctx.reduced) {
      ctx.gsap.from(ctx.scope.querySelector('[data-about-media]'), {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ctx.scope, start: 'top 78%', once: true },
      })
    }
  })

  return (
    <section ref={ref} id="aboutUs" className={`section ${styles.section}`} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.media} data-about-media>
          <img
            src={asset('mili-alastra-sinfondo.webp')}
            alt="Mili Alastra estirándose para jugar la bocha con el palo"
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.copy}>
          <span className="eyebrow" data-reveal>
            SOBRE NOSOTROS
          </span>
          <SectionTitle id="about-title" text="Vivimos el hockey con pasión y compromiso" />
          <p className={styles.text} data-reveal>
            Nos dedicamos a acompañar a jugadores, jugadoras y clubes en su crecimiento, ofreciendo servicios diseñados
            para impulsar una mejora constante y sostenida a lo largo del tiempo.
          </p>
          <ul className={styles.pills}>
            {PILLS.map((pill) => (
              <li key={pill} className={styles.pill} data-reveal>
                {pill}
              </li>
            ))}
          </ul>
          <div data-reveal>
            <Button onClick={() => openContact()}>CONTACTANOS</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
