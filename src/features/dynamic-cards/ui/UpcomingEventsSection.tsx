import { useCallback } from 'react'
import { DynamicCards } from './DynamicCards'
import { cardRepository } from '../infrastructure'
import type { PromoCard, PromoCardCategory } from '../domain/PromoCard'
import { SectionTitle } from '../../../shared/ui/SectionTitle'
import { useContactModal } from '../../contact/application/contactModalContext'
import type { Motivo } from '../../contact/domain/motivos'
import styles from './DynamicCards.module.css'

const MOTIVO_BY_CATEGORY: Record<PromoCardCategory, Motivo> = {
  campus: 'CAMPUS',
  gira: 'GIRAS',
  entrenamiento: 'PERSONALIZADOS',
  novedad: 'OTRO',
}

export const UpcomingEventsSection = () => {
  const { openContact } = useContactModal()
  const onCta = useCallback((card: PromoCard) => openContact(MOTIVO_BY_CATEGORY[card.category]), [openContact])

  return (
    <section id="events" className={`section ${styles.section}`} aria-labelledby="events-title">
      <div className="container">
        <header className={styles.header}>
          <span className="eyebrow">PRÓXIMOS EVENTOS</span>
          <SectionTitle id="events-title" text="Campus, giras y próximas fechas" />
        </header>
        <DynamicCards repository={cardRepository} onCta={onCta} />
      </div>
    </section>
  )
}
