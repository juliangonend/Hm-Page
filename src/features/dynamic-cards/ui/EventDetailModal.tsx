import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { PromoCard, PromoCardCategory } from '../domain/PromoCard'
import { Button, LinkButton } from '../../../shared/ui/Button'
import { useDialog } from '../../../shared/ui/useDialog'
import { useContactModal } from '../../contact/application/contactModalContext'
import type { Motivo } from '../../contact/domain/motivos'
import { formatLongDate, formatShortDate } from './eventFormat'
import { findCountry } from '../../../shared/domain/countries'
import styles from './EventDetailModal.module.css'

interface EventDetailModalProps {
  card: PromoCard
  toneClass: string
  onClose: () => void
}

const MOTIVO_BY_CATEGORY: Record<PromoCardCategory, Motivo> = {
  campus: 'CAMPUS',
  gira: 'GIRAS',
  entrenamiento: 'PERSONALIZADOS',
  novedad: 'OTRO',
}

/** 'Quiero consultar por "Gira España 2027" (5 jul 2027, Madrid, España).' */
const consultMessage = (card: PromoCard): string => {
  const details = [formatShortDate(card.startsAt), card.venue].filter(Boolean).join(', ')
  return `Quiero consultar por "${card.title}"${details ? ` (${details})` : ''}.`
}

/** "+ info": everything about one event, with its registration link and a shortcut to ask about it. */
export const EventDetailModal = ({ card, toneClass, onClose }: EventDetailModalProps) => {
  const { openContact } = useContactModal()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialog(panelRef, onClose, 'button')
  const date = formatLongDate(card.startsAt)

  const facts: Array<[string, string]> = []
  if (date) facts.push(['Fecha', date])
  if (card.time) facts.push(['Horario', `${card.time} hs`])
  if (card.venue) facts.push(['Sede', card.venue])
  const country = findCountry(card.country)
  if (country) facts.push(['País', country.label])
  if (card.priceLabel) facts.push(['Valor', card.priceLabel])
  if (typeof card.spotsLeft === 'number') facts.push(['Cupos', `Quedan ${card.spotsLeft} lugares`])

  return createPortal(
    <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className={`${styles.media} ${toneClass}`}>
          {card.imageUrl ? <img src={card.imageUrl} alt="" className={styles.image} /> : null}
          {card.venue ? (
            <span className={styles.venue}>
              <PinIcon /> {card.venue}
            </span>
          ) : null}
        </div>

        <div className={styles.body}>
          {card.badge ? <span className="eyebrow">{card.badge}</span> : null}
          <h2 id={titleId} className={styles.title}>
            {card.title}
          </h2>
          {card.subtitle ? <p className={styles.subtitle}>{card.subtitle}</p> : null}

          {facts.length > 0 ? (
            <dl className={styles.facts}>
              {facts.map(([label, value]) => (
                <div key={label} className={styles.fact}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className={styles.description}>{card.description}</p>

          <div className={styles.actions}>
            {card.ctaUrl ? (
              <LinkButton href={card.ctaUrl} target="_blank" rel="noreferrer">
                {card.ctaLabel} →
              </LinkButton>
            ) : null}
            <Button
              variant={card.ctaUrl ? 'outline' : 'primary'}
              onClick={() => {
                onClose()
                openContact(MOTIVO_BY_CATEGORY[card.category], consultMessage(card), card.country)
              }}
            >
              Consultar
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
    />
  </svg>
)
