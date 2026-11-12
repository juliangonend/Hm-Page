import { describe, expect, it, vi } from 'vitest'
import { ApiError, createAdminApi } from './adminApi'

const jsonResponse = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
  })

describe('adminApi', () => {
  it('logs in with JSON and sends the session cookie', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(200, { username: 'admin' }))
    const api = createAdminApi('/api', fetchFn)

    await expect(api.login('admin', 'secreto')).resolves.toEqual({ username: 'admin' })

    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('/api/auth/login')
    expect(init).toMatchObject({ method: 'POST', credentials: 'same-origin' })
    expect(JSON.parse(init.body)).toEqual({ username: 'admin', password: 'secreto' })
  })

  it('sends PUT and DELETE as POST + method override (some shared hosts filter them)', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(jsonResponse(200, { id: 3 })).mockResolvedValueOnce(jsonResponse(204))
    const api = createAdminApi('/api', fetchFn)

    await api.update(3, { title: 'x' } as never)
    await api.remove(3)

    expect(fetchFn.mock.calls[0][0]).toBe('/api/admin/events/3')
    expect(fetchFn.mock.calls[0][1].method).toBe('POST')
    expect(fetchFn.mock.calls[0][1].headers['X-HTTP-Method-Override']).toBe('PUT')
    expect(fetchFn.mock.calls[1][1].headers['X-HTTP-Method-Override']).toBe('DELETE')
  })

  it('uploads the photo as multipart form data', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(200, { id: 3 }))
    const api = createAdminApi('/api', fetchFn)
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' })

    await api.uploadImage(3, file)

    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('/api/admin/events/3/image')
    expect(init.body).toBeInstanceOf(FormData)
    expect((init.body as FormData).get('image')).toBe(file)
  })

  it('turns API errors into ApiError with status, message and field errors', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(jsonResponse(422, { error: 'Revisá los datos', fields: { title: 'Obligatorio' } }))
    const api = createAdminApi('/api', fetchFn)

    const error = await api.create({} as never).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 422, message: 'Revisá los datos', fields: { title: 'Obligatorio' } })
  })

  it('reports a network failure as status 0', async () => {
    const api = createAdminApi('/api', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(api.list()).rejects.toMatchObject({ status: 0 })
  })
})
