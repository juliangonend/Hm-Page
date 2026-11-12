import { DynamicCards } from './DynamicCards'
import { cardRepository } from '../infrastructure'
import { SectionTitle } from '../../../shared/ui/SectionTitle'
import styles from './DynamicCards.module.css'

export const UpcomingEventsSection = () => (
  <section id="events" className={`section ${styles.section}`} aria-labelledby="events-title">
    <div className="container">
      <header className={styles.header}>
        <span className="eyebrow">PRÓXIMOS EVENTOS</span>
        <SectionTitle id="events-title" text="Campus, giras y próximas fechas" />
      </header>
      <DynamicCards repository={cardRepository} />
    </div>
  </section>
)
