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
