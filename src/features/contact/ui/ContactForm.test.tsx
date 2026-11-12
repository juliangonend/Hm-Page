import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

type Props = { initialMotivo?: string; initialMessage?: string; initialCountry?: string }

const setup = (variant: 'modal' | 'inline' = 'modal', props: Props = {}) => {
  const openUrl = vi.fn()
  render(<ContactForm variant={variant} openUrl={openUrl} {...props} />)
  return { openUrl, user: userEvent.setup() }
}

const sentUrl = (openUrl: ReturnType<typeof vi.fn>) => new URL(openUrl.mock.calls[0][0])
const sentNumber = (openUrl: ReturnType<typeof vi.fn>) => sentUrl(openUrl).pathname.slice(1)
const sentText = (openUrl: ReturnType<typeof vi.fn>) => sentUrl(openUrl).searchParams.get('text')

describe('ContactForm', () => {
  it('asks for the country, not an email, and shows every required message', async () => {
    const { openUrl, user } = setup()
    expect(screen.queryByLabelText(/Correo/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Seleccioná tu país.')).toBeInTheDocument()
    expect(screen.getByText('Seleccioná un motivo de consulta.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje no puede estar vacío.')).toBeInTheDocument()
    expect(openUrl).not.toHaveBeenCalled()
  })

  it('shows the message counter', async () => {
    const { user } = setup()
    expect(screen.getByText('0/500')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/Mensaje/), 'Hola')
    expect(screen.getByText('4/500')).toBeInTheDocument()
  })

  it('opens the Argentina WhatsApp with name, motivo and message', async () => {
    const { openUrl, user } = setup()
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.selectOptions(screen.getByLabelText(/País/), 'Argentina')
    await user.selectOptions(screen.getByLabelText(/Motivo de consulta/), 'ARQUEROS')
    await user.type(screen.getByLabelText(/Mensaje/), 'Quiero entrenar')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(openUrl).toHaveBeenCalledTimes(1)
    expect(sentNumber(openUrl)).toBe('542616683140')
    expect(sentText(openUrl)).toBe('Hola! Soy Ana (Argentina).\nMotivo: ARQUEROS\n\nQuiero entrenar')
    expect(await screen.findByText('¡Listo! Te abrimos WhatsApp')).toBeInTheDocument()
  })

  it.each(['Chile', 'España'])('sends %s to the Spain WhatsApp line', async (country) => {
    const { openUrl, user } = setup('modal', { initialMotivo: 'GIRAS', initialMessage: 'Consulta por la gira' })
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.selectOptions(screen.getByLabelText(/País/), country)
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(sentNumber(openUrl)).toBe('34623036136')
    expect(sentText(openUrl)).toContain('Consulta por la gira')
  })

  it('can start with the country already chosen', async () => {
    const { openUrl, user } = setup('modal', { initialMotivo: 'CAMPUS', initialMessage: 'Hola', initialCountry: 'CL' })
    expect(screen.getByLabelText(/País/)).toHaveValue('CL')

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))
    expect(sentNumber(openUrl)).toBe('34623036136')
    expect(sentText(openUrl)).toContain('Soy Ana (Chile)')
  })

  it('uses motivo chips in the inline variant', async () => {
    const { openUrl, user } = setup('inline')
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.selectOptions(screen.getByLabelText(/País/), 'España')
    await user.click(screen.getByRole('radio', { name: 'Arqueros' }))
    await user.type(screen.getByLabelText(/Mensaje/), 'Hola')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(sentText(openUrl)).toContain('Motivo: ARQUEROS')
  })
})
