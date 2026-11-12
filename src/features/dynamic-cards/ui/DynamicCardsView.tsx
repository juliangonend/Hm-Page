import { useEffect, useRef, useState } from 'react'
import type { CardsStatus } from '../application/useCards'
import type { PromoCard, PromoCardCategory } from '../domain/PromoCard'
import { Button } from '../../../shared/ui/Button'
import { canAnimate, getGsap, useGsap } from '../../../shared/motion'
import { cx } from '../../../shared/lib/cx'
import { EventDetailModal, PinIcon } from './EventDetailModal'
import { formatDateRange } from './eventFormat'
import { CountryFlag } from '../../../shared/ui/CountryFlag'
import styles from './DynamicCards.module.css'

interface DynamicCardsViewProps {
  status: CardsStatus
  cards: PromoCard[]
}

const SKELETON_COUNT = 3

const CATEGORY_TONE: Record<PromoCardCategory, string> = {
  campus: styles.toneCampus,
  gira: styles.toneGira,
  entrenamiento: styles.toneEntrenamiento,
  novedad: styles.toneNovedad,
}

const EventCard = ({ card, onOpen }: { card: PromoCard; onOpen: (card: PromoCard) => void }) => {
  const date = formatDateRange(card.startsAt, card.endsAt)
  return (
    <li className={styles.card} data-event-card>
      <div className={cx(styles.media, CATEGORY_TONE[card.category])}>
        {card.imageUrl && <img src={card.imageUrl} alt="" loading="lazy" className={styles.image} />}
        {card.badge && <span className={styles.badge}>{card.badge}</span>}
        {card.country && <CountryFlag code={card.country} size={30} className={styles.flag} />}
      </div>
      <div className={styles.body}>
        {date && (
          <time className={styles.date} dateTime={card.startsAt}>
            {date}
          </time>
        )}
        <h3 className={styles.title}>{card.title}</h3>
        {card.subtitle && <p className={styles.subtitle}>{card.subtitle}</p>}
        {card.venue && (
          <p className={styles.venue}>
            <PinIcon /> {card.venue}
          </p>
        )}
        <p className={styles.description}>{card.description}</p>
        <div className={styles.footer}>
          {card.priceLabel && <span className={styles.price}>{card.priceLabel}</span>}
          {typeof card.spotsLeft === 'number' && (
            <span className={styles.spots}>Quedan {card.spotsLeft} lugares</span>
          )}
          <Button size="small" onClick={() => onOpen(card)} aria-label={`+ info sobre ${card.title}`}>
            + info
          </Button>
        </div>
      </div>
    </li>
  )
}

/** Presentational: renders loading skeletons, cards, or the empty state (also used as error fallback). */
export const DynamicCardsView = ({ status, cards }: DynamicCardsViewProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState<PromoCard | null>(null)

  // This section loads after the rest of the page and changes its height: every
  // scroll animation below it (reveals, the pinned clubs section) must re-measure.
  useEffect(() => {
    if (status !== 'loading' && canAnimate()) getGsap().ScrollTrigger.refresh()
  }, [status])

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
    <>
      <ul ref={listRef} className={styles.grid}>
        {cards.map((card) => (
          <EventCard key={card.id} card={card} onOpen={setOpen} />
        ))}
      </ul>
      {open && (
        <EventDetailModal
          card={open}
          toneClass={CATEGORY_TONE[open.category]}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}
