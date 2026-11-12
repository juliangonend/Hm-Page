import type { AdminEvent, EventPayload } from './AdminEvent'

export type EventFormValues = EventPayload

export const CURRENCIES = ['ARS', 'USD', 'EUR', 'CLP'] as const

export const EMPTY_FORM: EventFormValues = {
  title: '',
  subtitle: '',
  venue: '',
  description: '',
  date: '',
  link: '',
  price: '',
  currency: 'ARS',
  published: true,
}

/**
 * The API sends the date in the event's own time zone ("2027-02-10T09:00:00-03:00").
 * Its first 16 chars are exactly the wall-clock value a datetime-local input expects,
 * so the admin always sees the event time, wherever the browser is.
 */
export const toFormValues = (event: AdminEvent): EventFormValues => ({
  title: event.title,
  subtitle: event.subtitle ?? '',
  venue: event.venue ?? '',
  description: event.description,
  date: event.date.slice(0, 16),
  link: event.link ?? '',
  price: event.price ?? '',
  currency: event.currency,
  published: event.published,
})

export const toPayload = (values: EventFormValues): EventPayload => ({
  title: values.title.trim(),
  subtitle: values.subtitle.trim(),
  venue: values.venue.trim(),
  description: values.description.trim(),
  date: values.date,
  link: values.link.trim(),
  price: values.price.trim(),
  currency: values.currency,
  published: values.published,
})
