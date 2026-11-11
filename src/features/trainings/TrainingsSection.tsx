import { useRef } from 'react'
import { TRAININGS } from './trainings.data'
import { TRAINING_BALL_SIZE, playTrainingsMotion } from './trainingsMotion'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import { HockeyBall } from '../../shared/ui/HockeyBall'
import { asset } from '../../shared/lib/asset'
import { revealUp, useGsap } from '../../shared/motion'
import { useContactModal } from '../contact/application/contactModalContext'
import styles from './TrainingsSection.module.css'

export const TrainingsSection = () => {
  const ref = useRef<HTMLElement>(null)
  const { openContact } = useContactModal()

  useGsap(ref, (ctx) => {
    revealUp(ctx, ctx.scope.querySelectorAll('[data-reveal]'), ctx.scope)
    playTrainingsMotion(ctx)
  })

  return (
    <section ref={ref} id="ourServices" className={`section ${styles.section}`} aria-labelledby="trainings-title">
      <div className="container">
        <header className={styles.header}>
          <span className="eyebrow" data-reveal>
            ENTRENAMIENTOS
          </span>
          <SectionTitle id="trainings-title" text="Mucho más que entrenamientos de hockey" />
          <p className={styles.lead} data-reveal>
            Perfeccionamiento integral, adaptado al nivel de cada jugador y jugadora: psicomotricidad, arrastre,
            jugadores de campo, arqueros y más.
          </p>
        </header>

        <ul className={styles.grid} data-training-grid>
          {TRAININGS.map((training) => (
            <li key={training.id} className={styles.shell} data-training-shell>
              <article className={styles.card} data-training-card>
                <div className={styles.media}>
                  <img src={asset(training.image)} alt="" loading="lazy" className={styles.image} />
                  <span className={styles.badge} data-training-detail>
                    {training.badge}
                  </span>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{training.title}</h3>
                  <p className={styles.text}>{training.text}</p>
                  <button
                    type="button"
                    className={styles.cta}
                    data-training-detail
                    onClick={() => openContact(training.motivo)}
                    aria-label={`Inscribirme en ${training.title}`}
                  >
                    Inscribirme <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className={styles.track} data-ball-track aria-hidden="true">
          <span className={styles.trail} data-ball-trail />
          <HockeyBall size={TRAINING_BALL_SIZE} className={styles.ball} data-training-ball />
        </div>
      </div>
    </section>
  )
}
