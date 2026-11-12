import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

const setup = (variant: 'modal' | 'inline' = 'modal') => {
  const sender = vi.fn().mockResolvedValue(undefined)
  render(<ContactForm variant={variant} sender={sender} />)
  return { sender, user: userEvent.setup() }
}

describe('ContactForm', () => {
  it('shows required messages when submitting an empty form', async () => {
    const { sender, user } = setup()
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('Seleccioná un motivo de consulta.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje no puede estar vacío.')).toBeInTheDocument()
    expect(sender).not.toHaveBeenCalled()
  })

  it('shows the invalid email message on blur', async () => {
    const { user } = setup()
    await user.type(screen.getByLabelText(/Correo/), 'not-an-email')
    await user.tab()
    expect(screen.getByText('Ingresá un correo válido.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the message counter', async () => {
    const { user } = setup()
    expect(screen.getByText('0/500')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/Mensaje/), 'Hola')
    expect(screen.getByText('4/500')).toBeInTheDocument()
  })

  it('submits a valid form and shows the success banner', async () => {
    const { sender, user } = setup()
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo/), 'ana@mail.com')
    await user.selectOptions(screen.getByLabelText(/Motivo de consulta/), 'ARQUEROS')
    await user.type(screen.getByLabelText(/Mensaje/), 'Quiero entrenar')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(sender).toHaveBeenCalledTimes(1)
    expect(sender.mock.calls[0][0]).toBeInstanceOf(HTMLFormElement)
    expect(await screen.findByText('¡Formulario enviado correctamente!')).toBeInTheDocument()
  })

  it('shows the error banner when sending fails', async () => {
    const sender = vi.fn().mockRejectedValue(new Error('network'))
    const user = userEvent.setup()
    render(<ContactForm variant="modal" sender={sender} initialMotivo="GIRAS" />)
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo/), 'ana@mail.com')
    await user.type(screen.getByLabelText(/Mensaje/), 'Hola')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(await screen.findByText('Error al enviar el formulario')).toBeInTheDocument()
  })

  it('uses motivo chips in the inline variant', async () => {
    const { sender, user } = setup('inline')
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.type(screen.getByLabelText(/Correo/), 'ana@mail.com')
    await user.click(screen.getByRole('radio', { name: 'Arqueros' }))
    await user.type(screen.getByLabelText(/Mensaje/), 'Hola')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))
    expect(sender).toHaveBeenCalledTimes(1)
  })
})

describe('ContactForm via WhatsApp', () => {
  const setupWhatsapp = (props: { initialMotivo?: string; initialMessage?: string; initialCountry?: string } = {}) => {
    const openUrl = vi.fn()
    render(<ContactForm variant="modal" channel="whatsapp" openUrl={openUrl} {...props} />)
    return { openUrl, user: userEvent.setup() }
  }

  const sentText = (openUrl: ReturnType<typeof vi.fn>) => new URL(openUrl.mock.calls[0][0]).searchParams.get('text')
  const sentNumber = (openUrl: ReturnType<typeof vi.fn>) => new URL(openUrl.mock.calls[0][0]).pathname.slice(1)

  it('asks for the country instead of the email', async () => {
    const { openUrl, user } = setupWhatsapp()
    expect(screen.queryByLabelText(/Correo/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(screen.getByText('Seleccioná tu país.')).toBeInTheDocument()
    expect(openUrl).not.toHaveBeenCalled()
  })

  it('opens the Argentina WhatsApp with name, motivo and message', async () => {
    const { openUrl, user } = setupWhatsapp()
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

  it('can start with the country already chosen', async () => {
    const { openUrl, user } = setupWhatsapp({ initialMotivo: 'CAMPUS', initialMessage: 'Hola', initialCountry: 'CL' })
    expect(screen.getByLabelText(/País/)).toHaveValue('CL')

    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))
    expect(sentNumber(openUrl)).toBe('34623036136')
    expect(sentText(openUrl)).toContain('Soy Ana (Chile)')
  })

  it.each(['Chile', 'España'])('sends %s to the Spain WhatsApp line', async (country) => {
    const { openUrl, user } = setupWhatsapp({ initialMotivo: 'GIRAS', initialMessage: 'Consulta por la gira' })
    await user.type(screen.getByLabelText(/Nombre/), 'Ana')
    await user.selectOptions(screen.getByLabelText(/País/), country)
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }))

    expect(sentNumber(openUrl)).toBe('34623036136')
    expect(sentText(openUrl)).toContain('Consulta por la gira')
  })
})
