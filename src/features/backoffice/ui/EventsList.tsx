import type { AdminEvent } from '../domain/AdminEvent'
import styles from './Admin.module.css'

interface EventsListProps {
  events: AdminEvent[]
  onEdit: (event: AdminEvent) => void
  onDelete: (event: AdminEvent) => void
}

const EVENT_TIME_ZONE = 'America/Argentina/Buenos_Aires'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', {
    timeZone: EVENT_TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatPrice = (event: AdminEvent) =>
  event.price === null
    ? '—'
    : new Intl.NumberFormat('es-AR', { style: 'currency', currency: event.currency, maximumFractionDigits: 2 }).format(
        Number(event.price),
      )

const statusOf = (event: AdminEvent) => {
  if (!event.published) return { label: 'Borrador', tone: styles.statusDraft }
  if (new Date(event.date).getTime() < Date.now()) return { label: 'Pasado', tone: styles.statusPast }
  return { label: 'Publicado', tone: styles.statusLive }
}

export const EventsList = ({ events, onEdit, onDelete }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Todavía no cargaste eventos.</p>
        <p className={styles.muted}>Tocá “Nuevo evento” para crear el primero.</p>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {events.map((event) => {
        const status = statusOf(event)
        return (
          <li key={event.id} className={styles.item}>
            <div className={styles.thumb}>{event.imageUrl ? <img src={event.imageUrl} alt="" loading="lazy" /> : null}</div>
            <div className={styles.itemBody}>
              <div className={styles.itemTop}>
                <span className={`${styles.status} ${status.tone}`}>{status.label}</span>
                <time dateTime={event.date} className={styles.itemDate}>
                  {formatDate(event.date)}
                </time>
              </div>
              <h3 className={styles.itemTitle}>{event.title}</h3>
              {event.subtitle ? <p className={styles.itemSubtitle}>{event.subtitle}</p> : null}
              <p className={styles.itemText}>{event.description}</p>
              <p className={styles.itemMeta}>
                <span>Valor: {formatPrice(event)}</span>
                {event.venue ? <span>Sede: {event.venue}</span> : null}
                {event.link ? (
                  <a href={event.link} target="_blank" rel="noreferrer">
                    Ver link ↗
                  </a>
                ) : null}
              </p>
            </div>
            <div className={styles.itemActions}>
              <button type="button" className={styles.secondary} onClick={() => onEdit(event)} aria-label={`Editar ${event.title}`}>
                Editar
              </button>
              <button type="button" className={styles.danger} onClick={() => onDelete(event)} aria-label={`Borrar ${event.title}`}>
                Borrar
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
