import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrustedClubsWall } from './TrustedClubsWall'
import type { TrustedClub } from './TrustedClub'

const clubs: TrustedClub[] = [
  { id: 'a', name: 'Club Andino', logo: 'clubs/a.png' },
  { id: 'b', name: 'Club Bosque', logo: 'clubs/b.png' },
]

describe('TrustedClubsWall', () => {
  it('renders the headline over the logo field', () => {
    render(<TrustedClubsWall clubs={clubs} />)
    expect(screen.getByRole('heading', { name: 'Clubes que confían en nosotros' })).toBeInTheDocument()
  })

  it('exposes each club once to assistive technology, even when the field repeats logos', () => {
    render(<TrustedClubsWall clubs={clubs} />)
    expect(screen.getAllByRole('img').map((img) => img.getAttribute('alt'))).toEqual(['Club Andino', 'Club Bosque'])
  })

  it('calls onRequestProposal from the CTA', async () => {
    const onRequestProposal = vi.fn()
    render(<TrustedClubsWall clubs={clubs} onRequestProposal={onRequestProposal} />)
    await userEvent.click(screen.getByRole('button', { name: 'SOLICITAR PROPUESTA' }))
    expect(onRequestProposal).toHaveBeenCalledOnce()
  })

  it('renders nothing when there are no clubs', () => {
    const { container } = render(<TrustedClubsWall clubs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
