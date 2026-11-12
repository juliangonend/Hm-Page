import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminApp } from './AdminApp'
import { ApiError, type AdminApi } from '../infrastructure/adminApi'
import type { AdminEvent } from '../domain/AdminEvent'

const EVENT: AdminEvent = {
  id: 1,
  title: 'Campus de verano',
  subtitle: 'Arqueros y jugadores',
  venue: 'Club Alemán, Mendoza',
  country: 'AR',
  description: 'Tres días de entrenamiento',
  date: '2027-02-10T09:00:00-03:00',
  endDate: null,
  link: 'https://example.com',
  price: '45000.00',
  currency: 'ARS',
  imageUrl: null,
  published: true,
}

const unauthorized = () => new ApiError(401, 'Iniciá sesión para continuar.')

const fakeApi = (overrides: Partial<AdminApi> = {}): AdminApi => ({
  me: vi.fn().mockResolvedValue({ username: 'admin' }),
  login: vi.fn().mockResolvedValue({ username: 'admin' }),
  logout: vi.fn().mockResolvedValue(undefined),
  list: vi.fn().mockResolvedValue([EVENT]),
  create: vi.fn().mockResolvedValue({ ...EVENT, id: 2 }),
  update: vi.fn().mockResolvedValue(EVENT),
  remove: vi.fn().mockResolvedValue(undefined),
  uploadImage: vi.fn().mockResolvedValue(EVENT),
  removeImage: vi.fn().mockResolvedValue(EVENT),
  ...overrides,
})

describe('AdminApp', () => {
  it('asks to log in when there is no session, shows API errors and enters on success', async () => {
    const user = userEvent.setup()
    const api = fakeApi({
      me: vi.fn().mockRejectedValue(unauthorized()),
      login: vi
        .fn()
        .mockRejectedValueOnce(new ApiError(401, 'Usuario o contraseña incorrectos.'))
        .mockResolvedValueOnce({ username: 'admin' }),
    })
    render(<AdminApp api={api} />)

    await user.type(await screen.findByLabelText('Usuario'), 'admin')
    await user.type(screen.getByLabelText('Contraseña'), 'mala')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos.')

    await user.clear(screen.getByLabelText('Contraseña'))
    await user.type(screen.getByLabelText('Contraseña'), 'buena')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('Campus de verano')).toBeInTheDocument()
    expect(api.login).toHaveBeenLastCalledWith('admin', 'buena')
  })

  it('creates an event and then uploads its photo', async () => {
    const user = userEvent.setup()
    const api = fakeApi({ list: vi.fn().mockResolvedValueOnce([]).mockResolvedValue([EVENT]) })
    render(<AdminApp api={api} />)

    expect(await screen.findByText(/Todavía no cargaste eventos/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Nuevo evento' }))

    const form = screen.getByRole('form', { name: 'Nuevo evento' })
    await user.type(within(form).getByLabelText(/Título/), 'Clínica de arqueros')
    await user.type(within(form).getByLabelText(/Subtítulo/), 'Todas las edades')
    await user.type(within(form).getByLabelText(/Sede/), 'Club STM, San Juan')
    await user.selectOptions(within(form).getByLabelText(/País/), 'Chile')
    await user.type(within(form).getByLabelText(/Descripción/), 'Para todas las edades')
    await user.type(within(form).getByLabelText(/Fecha y hora/), '2027-03-01T18:00')
    await user.type(within(form).getByLabelText(/Fecha de fin/), '2027-03-03')
    await user.type(within(form).getByLabelText(/Valor/), '15000')
    const photo = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })
    await user.upload(within(form).getByLabelText(/Foto/), photo)
    await user.click(within(form).getByRole('button', { name: 'Guardar evento' }))

    await waitFor(() => expect(api.uploadImage).toHaveBeenCalledWith(2, photo))
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Clínica de arqueros',
        subtitle: 'Todas las edades',
        venue: 'Club STM, San Juan',
        country: 'CL',
        date: '2027-03-01T18:00', endDate: '2027-03-03', price: '15000', published: true,
      }),
    )
    expect(await screen.findByText('Campus de verano')).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('shows the field errors returned by the API next to each field', async () => {
    const user = userEvent.setup()
    const api = fakeApi({
      create: vi.fn().mockRejectedValue(new ApiError(422, 'Revisá los datos del formulario.', { date: 'La fecha no es válida.' })),
    })
    render(<AdminApp api={api} />)

    await user.click(await screen.findByRole('button', { name: 'Nuevo evento' }))
    await user.click(screen.getByRole('button', { name: 'Guardar evento' }))

    expect(await screen.findByText('La fecha no es válida.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Fecha y hora/)).toHaveAttribute('aria-invalid', 'true')
    expect(api.uploadImage).not.toHaveBeenCalled()
  })

  it('edits an existing event with its values prefilled', async () => {
    const user = userEvent.setup()
    const api = fakeApi()
    render(<AdminApp api={api} />)

    await user.click(await screen.findByRole('button', { name: 'Editar Campus de verano' }))
    const form = screen.getByRole('form', { name: 'Editar evento' })
    const title = within(form).getByLabelText(/Título/)
    expect(title).toHaveValue('Campus de verano')
    expect(within(form).getByLabelText(/Fecha y hora/)).toHaveValue('2027-02-10T09:00')

    await user.clear(title)
    await user.type(title, 'Campus de invierno')
    await user.click(within(form).getByRole('button', { name: 'Guardar evento' }))

    await waitFor(() => expect(api.update).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Campus de invierno' })))
    expect(api.uploadImage).not.toHaveBeenCalled()
  })

  it('deletes an event only after confirming', async () => {
    const user = userEvent.setup()
    const api = fakeApi({ list: vi.fn().mockResolvedValueOnce([EVENT]).mockResolvedValue([]) })
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    render(<AdminApp api={api} />)

    const button = await screen.findByRole('button', { name: 'Borrar Campus de verano' })
    await user.click(button)
    expect(api.remove).not.toHaveBeenCalled()

    await user.click(button)
    await waitFor(() => expect(api.remove).toHaveBeenCalledWith(1))
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(await screen.findByText(/Todavía no cargaste eventos/)).toBeInTheDocument()
  })

  it('goes back to the login when the session expires', async () => {
    const api = fakeApi({ list: vi.fn().mockRejectedValue(unauthorized()) })
    render(<AdminApp api={api} />)

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/sesión venció/)
  })

  it('logs out', async () => {
    const user = userEvent.setup()
    const api = fakeApi()
    render(<AdminApp api={api} />)

    await user.click(await screen.findByRole('button', { name: 'Cerrar sesión' }))
    expect(api.logout).toHaveBeenCalled()
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })
})
