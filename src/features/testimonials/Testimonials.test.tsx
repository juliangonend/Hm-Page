import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Testimonials } from './Testimonials'
import type { Testimonial } from './domain/Testimonial'

const ITEMS: Testimonial[] = [
  { id: 'a', author: 'Ana Pérez', club: 'STM Sports Club', url: 'https://www.instagram.com/reel/ABC123/' },
  { id: 'b', author: 'Juan Gómez', club: 'Old Gabs Hockey', url: 'https://youtu.be/dQw4w9WgXcQ' },
  { id: 'c', author: 'Roto', club: 'Nadie', url: 'https://vimeo.com/1' },
]

describe('Testimonials', () => {
  it('renders the heading and one embedded video per supported link', () => {
    render(<Testimonials items={ITEMS} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Testimonios' })).toBeInTheDocument()
    const instagram = screen.getByTitle('Testimonio de Ana Pérez (STM Sports Club)')
    expect(instagram).toHaveAttribute('src', 'https://www.instagram.com/reel/ABC123/embed/')
    expect(instagram).toHaveAttribute('loading', 'lazy')
    expect(screen.getByTitle('Testimonio de Juan Gómez (Old Gabs Hockey)')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  })

  it('skips testimonials whose link is not supported', () => {
    render(<Testimonials items={ITEMS} />)
    expect(screen.queryByText('Roto')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(2)
  })

  it('shows one video at a time and moves with the arrows and dots', async () => {
    const user = userEvent.setup()
    render(<Testimonials items={ITEMS} />)

    const dot = (n: number) => screen.getByRole('button', { name: `Ver testimonio ${n}` })
    const prev = screen.getByRole('button', { name: 'Testimonio anterior' })
    const next = screen.getByRole('button', { name: 'Testimonio siguiente' })

    expect(dot(1)).toHaveAttribute('aria-current', 'true')
    expect(prev).toBeDisabled()

    await user.click(next)
    expect(dot(2)).toHaveAttribute('aria-current', 'true')
    expect(dot(1)).not.toHaveAttribute('aria-current')
    expect(next).toBeDisabled()

    await user.click(dot(1))
    expect(dot(1)).toHaveAttribute('aria-current', 'true')
  })

  it('renders nothing when there are no valid testimonials', () => {
    const { container } = render(<Testimonials items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
