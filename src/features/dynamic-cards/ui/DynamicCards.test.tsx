import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicCardsView } from './DynamicCardsView'
import { DynamicCards } from './DynamicCards'
import type { PromoCard } from '../domain/PromoCard'
import { ContactModalContext } from '../../contact/application/contactModalContext'

const cards: PromoCard[] = [
  {
    id: '1',
    category: 'campus',
    title: 'Campus de invierno',
    description: 'Una semana intensiva',
    badge: 'Campus',
    ctaLabel: 'Inscribirme',
    spotsLeft: 4,
    published: true,
    order: 1,
  },
  {
    id: '2',
    category: 'gira',
    title: 'Gira España 2027',
    subtitle: 'Sub 16 y Sub 18',
    venue: 'Madrid, España',
    country: 'ES',
    startsAt: '2027-07-05',
    endsAt: '2027-07-12',
    priceLabel: '$ 1.500.000',
    description: 'Partidos y actividades.\nIncluye traslados.',
    ctaLabel: 'Más info',
    ctaUrl: 'https://example.com/gira',
    published: true,
    order: 2,
  },
]

describe('DynamicCardsView', () => {
  it('renders skeletons while loading', () => {
    render(<DynamicCardsView status="loading" cards={[]} />)
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
    expect(screen.getByRole('list', { busy: true })).toBeInTheDocument()
  })

  it('renders the cards when ready', () => {
    render(<DynamicCardsView status="ready" cards={cards} />)
    expect(screen.getByRole('heading', { name: 'Campus de invierno' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gira España 2027' })).toBeInTheDocument()
    expect(screen.getByText('Quedan 4 lugares')).toBeInTheDocument()
    expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument()
  })

  it('shows the date range without time, the subtitle with the venue under it and the price', () => {
    render(<DynamicCardsView status="ready" cards={cards} />)
    const card = screen.getByRole('heading', { name: 'Gira España 2027' }).closest('li') as HTMLElement

    const date = card.querySelector('time') as HTMLElement
    expect(date).toHaveTextContent(/5.*12.*jul.*2027/)
    expect(date).not.toHaveTextContent(/hs/)

    const subtitle = within(card).getByText('Sub 16 y Sub 18')
    const venue = within(card).getByText('Madrid, España')
    // The venue now sits in the body, right after the subtitle (no longer a sign on the photo)
    expect(subtitle.compareDocumentPosition(venue) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(card.querySelector('img, [class*="media"]')?.textContent ?? '').not.toContain('Madrid')
    expect(within(card).getByText('$ 1.500.000')).toBeInTheDocument()
  })

  it('opens the full detail with "+ info", including the registration link', async () => {
    const user = userEvent.setup()
    render(<DynamicCardsView status="ready" cards={cards} />)

    await user.click(screen.getByRole('button', { name: '+ info sobre Gira España 2027' }))

    const dialog = screen.getByRole('dialog', { name: 'Gira España 2027' })
    expect(within(dialog).getByText('Sub 16 y Sub 18')).toBeInTheDocument()
    // Venue appears as the sign on the photo and in the facts list
    expect(within(dialog).getAllByText('Madrid, España')).toHaveLength(2)
    expect(within(dialog).queryByText('Horario')).not.toBeInTheDocument()
    expect(within(dialog).getByText('Fecha').nextElementSibling).toHaveTextContent(/5.*12.*julio.*2027/)
    expect(within(dialog).getByText('$ 1.500.000')).toBeInTheDocument()
    expect(within(dialog).getByText(/Incluye traslados/)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /Más info/ })).toHaveAttribute('href', 'https://example.com/gira')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('"Consultar" in the detail closes it and opens the contact form about that event', async () => {
    const user = userEvent.setup()
    const openContact = vi.fn()
    render(
      <ContactModalContext.Provider value={{ openContact }}>
        <DynamicCardsView status="ready" cards={cards} />
      </ContactModalContext.Provider>,
    )

    await user.click(screen.getByRole('button', { name: '+ info sobre Gira España 2027' }))
    const dialog = screen.getByRole('dialog', { name: 'Gira España 2027' })
    await user.click(within(dialog).getByRole('button', { name: 'Consultar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(openContact).toHaveBeenCalledTimes(1)
    const [motivo, message] = openContact.mock.calls[0]
    expect(motivo).toBe('GIRAS')
    expect(openContact.mock.calls[0][2]).toBe('ES')
    expect(message).toMatch(/^Quiero consultar por "Gira España 2027" \(.*2027, Madrid, España\)\.$/)
  })

  it('shows the flag of the event country on the card', () => {
    render(<DynamicCardsView status="ready" cards={cards} />)

    expect(screen.getByRole('img', { name: 'España' })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /Argentina|Chile|España/ })).toHaveLength(1)
  })

  it('renders the empty state', () => {
    render(<DynamicCardsView status="empty" cards={[]} />)
    expect(screen.getByText('Pronto nuevas fechas')).toBeInTheDocument()
    expect(
      screen.getByText('Dejanos tu mail y te avisamos cuando abramos inscripciones.'),
    ).toBeInTheDocument()
  })

  it('falls back to the empty state on error', () => {
    render(<DynamicCardsView status="error" cards={[]} />)
    expect(screen.getByText('Pronto nuevas fechas')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('DynamicCards (container)', () => {
  it('loads cards from the injected repository', async () => {
    const repository = { list: () => Promise.resolve(cards) }
    render(<DynamicCards repository={repository} />)
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
    expect(await screen.findByRole('heading', { name: 'Campus de invierno' })).toBeInTheDocument()
  })
})
