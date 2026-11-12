import { describe, expect, it } from 'vitest'
import { EMPTY_FORM, toFormValues, toPayload } from './eventForm'
import type { AdminEvent } from './AdminEvent'

const EVENT: AdminEvent = {
  id: 7,
  title: 'Campus de verano',
  subtitle: 'Arqueros y jugadores',
  venue: 'Club Alemán, Mendoza',
  description: 'Tres días',
  date: '2027-02-10T09:00:00-03:00',
  link: 'https://example.com',
  price: '45000.50',
  currency: 'ARS',
  imageUrl: '/uploads/events/event-7.webp',
  published: false,
}

describe('eventForm', () => {
  it('starts empty, published and in ARS', () => {
    expect(EMPTY_FORM).toEqual({
      title: '',
      subtitle: '',
      venue: '',
      description: '',
      date: '',
      link: '',
      price: '',
      currency: 'ARS',
      published: true,
    })
  })

  it('fills the form from an event, keeping the event wall-clock time for datetime-local', () => {
    expect(toFormValues(EVENT)).toEqual({
      title: 'Campus de verano',
      subtitle: 'Arqueros y jugadores',
      venue: 'Club Alemán, Mendoza',
      description: 'Tres días',
      date: '2027-02-10T09:00',
      link: 'https://example.com',
      price: '45000.50',
      currency: 'ARS',
      published: false,
    })
  })

  it('maps missing optional fields to empty inputs', () => {
    expect(toFormValues({ ...EVENT, subtitle: null, venue: null, link: null, price: null })).toMatchObject({
      subtitle: '',
      venue: '',
      link: '',
      price: '',
    })
  })

  it('trims text before sending it to the API', () => {
    expect(
      toPayload({ ...toFormValues(EVENT), title: '  Campus  ', venue: ' Mendoza ', link: ' ', price: ' 100 ' }),
    ).toEqual({
      title: 'Campus',
      subtitle: 'Arqueros y jugadores',
      venue: 'Mendoza',
      description: 'Tres días',
      date: '2027-02-10T09:00',
      link: '',
      price: '100',
      currency: 'ARS',
      published: false,
    })
  })
})
