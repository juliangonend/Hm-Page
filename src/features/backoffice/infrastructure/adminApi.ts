import type { AdminEvent, EventPayload } from '../domain/AdminEvent'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface AdminApi {
  me(): Promise<{ username: string }>
  login(username: string, password: string): Promise<{ username: string }>
  logout(): Promise<void>
  list(): Promise<AdminEvent[]>
  create(payload: EventPayload): Promise<AdminEvent>
  update(id: number, payload: EventPayload): Promise<AdminEvent>
  remove(id: number): Promise<void>
  uploadImage(id: number, file: File): Promise<AdminEvent>
  removeImage(id: number): Promise<AdminEvent>
}

type FetchFn = typeof fetch

const NETWORK_ERROR = 'No se pudo conectar con el servidor. Revisá tu conexión.'

/** HTTP client for the PHP back office. PUT/DELETE travel as POST + override header (shared hosts may filter them). */
export const createAdminApi = (base: string, fetchFn: FetchFn = (...args) => fetch(...args)): AdminApi => {
  const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const isForm = body instanceof FormData
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
    if (method === 'PUT' || method === 'DELETE') headers['X-HTTP-Method-Override'] = method

    let response: Response
    try {
      response = await fetchFn(`${base}${path}`, {
        method: method === 'GET' ? 'GET' : 'POST',
        credentials: 'same-origin',
        headers,
        body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      })
    } catch {
      throw new ApiError(0, NETWORK_ERROR)
    }

    const data: unknown = response.status === 204 ? undefined : await response.json().catch(() => undefined)
    if (!response.ok) {
      const error = (data ?? {}) as { error?: string; fields?: Record<string, string> }
      throw new ApiError(response.status, error.error ?? 'Algo salió mal. Probá de nuevo.', error.fields ?? {})
    }
    return data as T
  }

  return {
    me: () => request('GET', '/auth/me'),
    login: (username, password) => request('POST', '/auth/login', { username, password }),
    logout: () => request('POST', '/auth/logout'),
    list: () => request('GET', '/admin/events'),
    create: (payload) => request('POST', '/admin/events', payload),
    update: (id, payload) => request('PUT', `/admin/events/${id}`, payload),
    remove: (id) => request('DELETE', `/admin/events/${id}`),
    uploadImage: (id, file) => {
      const form = new FormData()
      form.append('image', file)
      return request('POST', `/admin/events/${id}/image`, form)
    },
    removeImage: (id) => request('DELETE', `/admin/events/${id}/image`),
  }
}
