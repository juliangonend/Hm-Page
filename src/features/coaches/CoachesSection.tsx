import { useRef } from 'react'
import { COACHES } from './coaches.data'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import { asset } from '../../shared/lib/asset'
import { revealUp, useGsap } from '../../shared/motion'
import styles from './CoachesSection.module.css'

export const CoachesSection = () => {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, (ctx) => {
    const { gsap, reduced, scope } = ctx
    revealUp(ctx, scope.querySelectorAll('[data-reveal]'), scope)
    revealUp(ctx, scope.querySelectorAll('[data-coach-card]'), scope.querySelector('[data-coach-list]'), { stagger: 0.12 })
    if (reduced) return
    scope.querySelectorAll('[data-coach-photo]').forEach((photo) => {
      gsap.fromTo(
        photo,
        { scale: 1.12 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'center center', scrub: true } },
      )
    })
  })

  return (
    <section ref={ref} id="co-funders" className={`section ${styles.section}`} aria-labelledby="coaches-title">
      <div className="container">
        <header className={styles.header}>
          <span className="eyebrow" data-reveal>
            ENTRENADORES
          </span>
          <SectionTitle id="coaches-title" text="Co-Fundadores" />
        </header>

        <ul className={styles.list} data-coach-list>
          {COACHES.map((coach) => (
            <li key={coach.firstName} className={styles.card} data-coach-card>
              <div className={styles.info}>
                <span className={styles.tag}>{coach.tag}</span>
                <h3 className={styles.name}>
                  <span className={styles.first}>{coach.firstName}</span>{' '}
                  <span className={styles.last}>{coach.lastName}</span>
                </h3>
                <ul className={styles.achievements}>
                  {coach.achievements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.photoWrap}>
                <img src={asset(coach.photo)} alt={coach.alt} className={styles.photo} loading="lazy" data-coach-photo />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
