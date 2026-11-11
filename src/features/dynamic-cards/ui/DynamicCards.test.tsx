import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    description: 'Partidos y actividades',
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

  it('renders an external link when the card has a ctaUrl', () => {
    render(<DynamicCardsView status="ready" cards={cards} onCta={vi.fn()} />)
    expect(screen.getByRole('link', { name: /Más info/ })).toHaveAttribute('href', 'https://example.com/gira')
  })

  it('calls onCta with the card when the card has no ctaUrl', async () => {
    const onCta = vi.fn()
    render(<DynamicCardsView status="ready" cards={cards} onCta={onCta} />)
    await userEvent.click(screen.getByRole('button', { name: /Inscribirme/ }))
    expect(onCta).toHaveBeenCalledWith(cards[0])
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
