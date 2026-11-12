import { useRef } from 'react'
import { useGsap } from '../../shared/motion'
import { CountryFlag } from '../../shared/ui/CountryFlag'
import { COUNTRIES } from '../../shared/domain/countries'
import styles from './StatsBand.module.css'

const STATS = [
  { value: 3, suffix: '', label: 'Sedes', detail: '', flags: true },
  { value: 4000, suffix: '+', label: 'Jugadores' },
  { value: 10, suffix: '+', label: 'Giras deportivas' },
  { value: 15, suffix: '+', label: 'Años de trayectoria' },
]

export const StatsBand = () => {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ gsap, reduced, scope }) => {
    const numbers = Array.from(scope.querySelectorAll<HTMLElement>('[data-count]'))
    if (reduced) {
      gsap.from(scope.querySelectorAll('li'), { opacity: 0, duration: 0.2, scrollTrigger: { trigger: scope, start: 'top 85%', once: true } })
      return
    }
    numbers.forEach((el) => {
      const target = Number(el.dataset.count)
      const suffix = el.dataset.suffix ?? ''
      const counter = { value: 0 }
      gsap.to(counter, {
        value: target,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
        onStart: () => {
          el.textContent = `0${suffix}`
        },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.value)}${suffix}`
        },
      })
    })
  })

  return (
    <section ref={ref} className={styles.band} aria-label="Hockey Management en números">
      <ul className={styles.list}>
        {STATS.map((stat) => (
          <li key={stat.label} className={styles.item}>
            <span className={styles.number} data-count={stat.value} data-suffix={stat.suffix}>
              {stat.value}
              {stat.suffix}
            </span>
            <span className={styles.label}>{stat.label}</span>
            {stat.detail && <span className={styles.detail}>{stat.detail}</span>}
            {stat.flags && (
              <span className={styles.flags}>
                {COUNTRIES.map(({ code }) => (
                  <CountryFlag key={code} code={code} size={34} className={styles.flag} />
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
