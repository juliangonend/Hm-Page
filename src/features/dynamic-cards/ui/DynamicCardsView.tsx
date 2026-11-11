import { useRef } from 'react'
import type { CardsStatus } from '../application/useCards'
import type { PromoCard, PromoCardCategory } from '../domain/PromoCard'
import { Button, LinkButton } from '../../../shared/ui/Button'
import { useGsap } from '../../../shared/motion'
import { cx } from '../../../shared/lib/cx'
import styles from './DynamicCards.module.css'

interface DynamicCardsViewProps {
  status: CardsStatus
  cards: PromoCard[]
  onCta: (card: PromoCard) => void
}

const SKELETON_COUNT = 3

const CATEGORY_TONE: Record<PromoCardCategory, string> = {
  campus: styles.toneCampus,
  gira: styles.toneGira,
  entrenamiento: styles.toneEntrenamiento,
  novedad: styles.toneNovedad,
}

const formatDate = (iso?: string): string | null => {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EventCard = ({ card, onCta }: { card: PromoCard; onCta: (card: PromoCard) => void }) => {
  const date = formatDate(card.startsAt)
  return (
    <li className={styles.card} data-event-card>
      <div className={cx(styles.media, CATEGORY_TONE[card.category])}>
        {card.imageUrl && <img src={card.imageUrl} alt="" loading="lazy" className={styles.image} />}
        {card.badge && <span className={styles.badge}>{card.badge}</span>}
      </div>
      <div className={styles.body}>
        {date && (
          <time className={styles.date} dateTime={card.startsAt}>
            {date}
          </time>
        )}
        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.description}>{card.description}</p>
        <div className={styles.footer}>
          {typeof card.spotsLeft === 'number' && (
            <span className={styles.spots}>Quedan {card.spotsLeft} lugares</span>
          )}
          {card.ctaUrl ? (
            <LinkButton href={card.ctaUrl} target="_blank" rel="noreferrer" size="small">
              {card.ctaLabel} →
            </LinkButton>
          ) : (
            <Button size="small" onClick={() => onCta(card)}>
              {card.ctaLabel} →
            </Button>
          )}
        </div>
      </div>
    </li>
  )
}

/** Presentational: renders loading skeletons, cards, or the empty state (also used as error fallback). */
export const DynamicCardsView = ({ status, cards, onCta }: DynamicCardsViewProps) => {
  const listRef = useRef<HTMLUListElement>(null)

  useGsap(
    listRef,
    ({ gsap, reduced, scope }) => {
      const items = scope.querySelectorAll('[data-event-card]')
      if (items.length === 0) return
      gsap.from(items, {
        y: reduced ? 0 : 32,
        opacity: 0,
        duration: reduced ? 0.2 : 0.7,
        ease: 'power3.out',
        stagger: reduced ? 0 : 0.08,
        scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
      })
    },
    status,
  )

  if (status === 'loading') {
    return (
      <ul className={styles.grid} aria-busy="true" aria-label="Cargando próximos eventos">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <li key={i} className={cx(styles.card, styles.skeleton)} data-testid="card-skeleton">
            <div className={cx(styles.media, styles.shimmer)} />
            <div className={styles.body}>
              <div className={cx(styles.line, styles.shimmer)} style={{ width: '70%' }} />
              <div className={cx(styles.line, styles.shimmer)} />
              <div className={cx(styles.line, styles.shimmer)} style={{ width: '85%' }} />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (status === 'empty' || status === 'error') {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Pronto nuevas fechas</p>
        <p>Dejanos tu mail y te avisamos cuando abramos inscripciones.</p>
      </div>
    )
  }

  return (
    <ul ref={listRef} className={styles.grid}>
      {cards.map((card) => (
        <EventCard key={card.id} card={card} onCta={onCta} />
      ))}
    </ul>
  )
}
