import { useCallback, useEffect, useState } from 'react'
import type { AdminEvent } from '../domain/AdminEvent'
import { toPayload, type EventFormValues } from '../domain/eventForm'
import { ApiError, type AdminApi } from '../infrastructure/adminApi'
import { LoginForm } from './LoginForm'
import { EventForm, type PhotoChange } from './EventForm'
import { EventsList } from './EventsList'
import styles from './Admin.module.css'

interface AdminAppProps {
  api: AdminApi
}

type Session = { state: 'checking' } | { state: 'anonymous'; notice?: string } | { state: 'authenticated'; username: string }

const EXPIRED = 'Tu sesión venció. Volvé a ingresar.'

/** Container: session, events loading and the create/edit/delete flows of the back office. */
export const AdminApp = ({ api }: AdminAppProps) => {
  const [session, setSession] = useState<Session>({ state: 'checking' })
  const [events, setEvents] = useState<AdminEvent[] | null>(null)
  const [editing, setEditing] = useState<AdminEvent | 'new' | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  /** 401 anywhere = the session is gone: back to the login. Other errors bubble up to the caller. */
  const guard = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T> => {
      try {
        return await action()
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setSession({ state: 'anonymous', notice: EXPIRED })
          setEditing(null)
        }
        throw error
      }
    },
    [],
  )

  const reload = useCallback(async () => {
    try {
      setEvents(await guard(() => api.list()))
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        setBanner(error instanceof Error ? error.message : 'No se pudieron cargar los eventos.')
      }
    }
  }, [api, guard])

  useEffect(() => {
    api
      .me()
      .then(({ username }) => setSession({ state: 'authenticated', username }))
      .catch(() => setSession({ state: 'anonymous' }))
  }, [api])

  useEffect(() => {
    if (session.state === 'authenticated') void reload()
  }, [session.state, reload])

  const login = async (username: string, password: string) => {
    const user = await api.login(username, password)
    setBanner(null)
    setSession({ state: 'authenticated', username: user.username })
  }

  const logout = async () => {
    await api.logout().catch(() => undefined)
    setEvents(null)
    setEditing(null)
    setSession({ state: 'anonymous' })
  }

  const save = async (values: EventFormValues, photo: PhotoChange) => {
    const target = editing
    const saved = await guard(() =>
      target === 'new' || target === null ? api.create(toPayload(values)) : api.update(target.id, toPayload(values)),
    )
    try {
      if (photo.file) await guard(() => api.uploadImage(saved.id, photo.file as File))
      else if (photo.remove && saved.imageUrl) await guard(() => api.removeImage(saved.id))
      setBanner(null)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) throw error
      // The event itself is saved: report the photo problem without losing it
      setBanner(`El evento se guardó, pero la foto no: ${error instanceof Error ? error.message : 'error desconocido'}`)
    }
    setEditing(null)
    await reload()
  }

  const remove = async (event: AdminEvent) => {
    if (!window.confirm(`¿Borrar "${event.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await guard(() => api.remove(event.id))
      await reload()
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        setBanner(error instanceof Error ? error.message : 'No se pudo borrar el evento.')
      }
    }
  }

  if (session.state === 'checking') {
    return (
      <main className={styles.loginPage} aria-busy="true">
        <p className={styles.muted}>Cargando…</p>
      </main>
    )
  }

  if (session.state === 'anonymous') return <LoginForm onLogin={login} notice={session.notice} />

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}logo-hm.png`} alt="" />
          <span>Back office</span>
        </div>
        <div className={styles.user}>
          <span className={styles.muted}>{session.username}</span>
          <button type="button" className={styles.ghostLight} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {banner ? (
          <p role="alert" className={styles.banner}>
            {banner}
            <button type="button" onClick={() => setBanner(null)} aria-label="Cerrar aviso">
              ×
            </button>
          </p>
        ) : null}

        {editing ? (
          <EventForm
            key={editing === 'new' ? 'new' : editing.id}
            event={editing === 'new' ? null : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <section className={styles.panel} aria-labelledby="events-heading">
            <div className={styles.panelHeader}>
              <div>
                <h1 id="events-heading" className={styles.panelTitle}>
                  Próximos eventos
                </h1>
                <p className={styles.muted}>Lo publicado y con fecha futura aparece en la web, ordenado por fecha.</p>
              </div>
              <button type="button" className={styles.primary} onClick={() => setEditing('new')}>
                Nuevo evento
              </button>
            </div>
            {events === null ? <p className={styles.muted}>Cargando eventos…</p> : <EventsList events={events} onEdit={setEditing} onDelete={remove} />}
          </section>
        )}
      </main>
    </div>
  )
}
