import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventForm } from './EventForm'
import type { AdminEvent } from '../domain/AdminEvent'

const EVENT: AdminEvent = {
  id: 1,
  title: 'Campus de verano',
  subtitle: 'Arqueros y jugadores',
  venue: 'Club Alemán, Mendoza',
  country: 'AR',
  description: 'Tres días de entrenamiento',
  date: '2027-02-10T09:00:00-03:00',
  link: null,
  price: null,
  currency: 'ARS',
  imageUrl: '/uploads/events/event-1.webp',
  published: true,
}

const renderForm = (event: AdminEvent | null) =>
  render(<EventForm event={event} onSubmit={vi.fn()} onCancel={vi.fn()} />)

describe('EventForm photo preview', () => {
  it('opens the photo at full size and closes it again', async () => {
    const user = userEvent.setup()
    renderForm(EVENT)

    await user.click(screen.getByRole('button', { name: 'Ver foto completa' }))

    const dialog = screen.getByRole('dialog', { name: 'Foto completa' })
    expect(dialog.querySelector('img')).toHaveAttribute('src', EVENT.imageUrl)

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the full-size photo by clicking the preview', async () => {
    const user = userEvent.setup()
    renderForm(EVENT)

    await user.click(screen.getByRole('button', { name: 'Ampliar foto' }))

    expect(screen.getByRole('dialog', { name: 'Foto completa' })).toBeInTheDocument()
  })

  it('closes the full-size photo with Escape', async () => {
    const user = userEvent.setup()
    renderForm(EVENT)

    await user.click(screen.getByRole('button', { name: 'Ver foto completa' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers no full-size view when there is no photo', () => {
    renderForm(null)

    expect(screen.queryByRole('button', { name: 'Ver foto completa' })).not.toBeInTheDocument()
  })
})
