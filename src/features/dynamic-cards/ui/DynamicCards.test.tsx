import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicCardsView } from './DynamicCardsView'
import { DynamicCards } from './DynamicCards'
import type { PromoCard } from '../domain/PromoCard'

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
    startsAt: '2027-07-05',
    time: '09:30',
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
    render(<DynamicCardsView status="loading" cards={[]} onCta={vi.fn()} />)
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
    expect(screen.getByRole('list', { busy: true })).toBeInTheDocument()
  })

  it('renders the cards when ready', () => {
    render(<DynamicCardsView status="ready" cards={cards} onCta={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Campus de invierno' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gira España 2027' })).toBeInTheDocument()
    expect(screen.getByText('Quedan 4 lugares')).toBeInTheDocument()
    expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument()
  })

  it('shows the subtitle, the venue sign and the price on the card', () => {
    render(<DynamicCardsView status="ready" cards={cards} onCta={vi.fn()} />)
    const card = screen.getByRole('heading', { name: 'Gira España 2027' }).closest('li') as HTMLElement
    expect(within(card).getByText('Sub 16 y Sub 18')).toBeInTheDocument()
    expect(within(card).getByText('Madrid, España')).toBeInTheDocument()
    expect(within(card).getByText('$ 1.500.000')).toBeInTheDocument()
  })

  it('opens the full detail with "+ info", including the registration link', async () => {
    const user = userEvent.setup()
    render(<DynamicCardsView status="ready" cards={cards} onCta={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '+ info sobre Gira España 2027' }))

    const dialog = screen.getByRole('dialog', { name: 'Gira España 2027' })
    expect(within(dialog).getByText('Sub 16 y Sub 18')).toBeInTheDocument()
    // Venue appears as the sign on the photo and in the facts list
    expect(within(dialog).getAllByText('Madrid, España')).toHaveLength(2)
    expect(within(dialog).getByText(/09:30/)).toBeInTheDocument()
    expect(within(dialog).getByText('$ 1.500.000')).toBeInTheDocument()
    expect(within(dialog).getByText(/Incluye traslados/)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /Más info/ })).toHaveAttribute('href', 'https://example.com/gira')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('"Consultar" in the detail closes it and calls onCta with the card', async () => {
    const user = userEvent.setup()
    const onCta = vi.fn()
    render(<DynamicCardsView status="ready" cards={cards} onCta={onCta} />)

    await user.click(screen.getByRole('button', { name: '+ info sobre Campus de invierno' }))
    const dialog = screen.getByRole('dialog', { name: 'Campus de invierno' })
    expect(within(dialog).queryByRole('link')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Consultar' }))
    expect(onCta).toHaveBeenCalledWith(cards[0])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the empty state', () => {
    render(<DynamicCardsView status="empty" cards={[]} onCta={vi.fn()} />)
    expect(screen.getByText('Pronto nuevas fechas')).toBeInTheDocument()
    expect(
      screen.getByText('Dejanos tu mail y te avisamos cuando abramos inscripciones.'),
    ).toBeInTheDocument()
  })

  it('falls back to the empty state on error', () => {
    render(<DynamicCardsView status="error" cards={[]} onCta={vi.fn()} />)
    expect(screen.getByText('Pronto nuevas fechas')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('DynamicCards (container)', () => {
  it('loads cards from the injected repository', async () => {
    const repository = { list: () => Promise.resolve(cards) }
    render(<DynamicCards repository={repository} onCta={vi.fn()} />)
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0)
    expect(await screen.findByRole('heading', { name: 'Campus de invierno' })).toBeInTheDocument()
  })
})
