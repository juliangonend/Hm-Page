import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import type { AdminEvent } from '../domain/AdminEvent'
import { CURRENCIES, EMPTY_FORM, toFormValues, type EventFormValues } from '../domain/eventForm'
import { ApiError } from '../infrastructure/adminApi'
import styles from './Admin.module.css'

export interface PhotoChange {
  file: File | null
  remove: boolean
}

interface EventFormProps {
  event: AdminEvent | null
  onSubmit: (values: EventFormValues, photo: PhotoChange) => Promise<void>
  onCancel: () => void
}

const ACCEPTED_PHOTOS = 'image/jpeg,image/png,image/webp'

const usePreview = (file: File | null): string | null => {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!file || typeof URL.createObjectURL !== 'function') {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return url
}

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: (props: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode
}

const Field = ({ label, error, hint, children }: FieldProps) => {
  const id = useId()
  const messageId = `${id}-message`
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error || hint ? messageId : undefined,
      })}
      {error ? (
        <span id={messageId} className={styles.fieldError}>
          {error}
        </span>
      ) : hint ? (
        <span id={messageId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  )
}

export const EventForm = ({ event, onSubmit, onCancel }: EventFormProps) => {
  const [values, setValues] = useState<EventFormValues>(event ? toFormValues(event) : EMPTY_FORM)
  const [photo, setPhoto] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const preview = usePreview(photo)
  const currentImage = preview ?? (removePhoto ? null : event?.imageUrl ?? null)
  const title = event ? 'Editar evento' : 'Nuevo evento'

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErrors({})
    setFormError(null)
    try {
      await onSubmit(values, { file: photo, remove: removePhoto })
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) setErrors(error.fields)
      setFormError(error instanceof Error ? error.message : 'No se pudo guardar el evento.')
      setBusy(false)
    }
  }

  return (
    <form className={styles.panel} onSubmit={submit} aria-label={title} noValidate>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{title}</h2>
        <button type="button" className={styles.ghost} onClick={onCancel}>
          Cancelar
        </button>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formMain}>
          <Field label="Título *" error={errors.title}>
            {(props) => (
              <input {...props} className={styles.input} value={values.title} maxLength={150} onChange={(e) => set('title', e.target.value)} />
            )}
          </Field>

          <Field label="Subtítulo (opcional)" error={errors.subtitle} hint="Una línea debajo del título, ej.: Arqueros y jugadores de campo">
            {(props) => (
              <input {...props} className={styles.input} value={values.subtitle} maxLength={200} onChange={(e) => set('subtitle', e.target.value)} />
            )}
          </Field>

          <Field label="Sede (opcional)" error={errors.venue} hint="Se muestra como cartel sobre la foto, ej.: Club Alemán, Mendoza">
            {(props) => (
              <input {...props} className={styles.input} value={values.venue} maxLength={150} onChange={(e) => set('venue', e.target.value)} />
            )}
          </Field>

          <Field label="Descripción *" error={errors.description} hint="Texto completo que se ve al tocar “+ info”. Los saltos de línea se respetan.">
            {(props) => (
              <textarea
                {...props}
                className={styles.textarea}
                rows={7}
                value={values.description}
                maxLength={5000}
                onChange={(e) => set('description', e.target.value)}
              />
            )}
          </Field>

          <div className={styles.row}>
            <Field label="Fecha y hora *" error={errors.date}>
              {(props) => (
                <input {...props} type="datetime-local" className={styles.input} value={values.date} onChange={(e) => set('date', e.target.value)} />
              )}
            </Field>
            <Field label="Valor (opcional)" error={errors.price} hint="Vacío = no se muestra precio">
              {(props) => (
                <input
                  {...props}
                  className={styles.input}
                  inputMode="decimal"
                  placeholder="45000"
                  value={values.price}
                  onChange={(e) => set('price', e.target.value)}
                />
              )}
            </Field>
            <Field label="Moneda" error={errors.currency}>
              {(props) => (
                <select {...props} className={styles.input} value={values.currency} onChange={(e) => set('currency', e.target.value)}>
                  {CURRENCIES.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          <Field label="Link (opcional)" error={errors.link} hint="Inscripción o más información. Si está vacío, el botón abre el formulario de contacto.">
            {(props) => (
              <input
                {...props}
                type="url"
                className={styles.input}
                placeholder="https://"
                value={values.link}
                onChange={(e) => set('link', e.target.value)}
              />
            )}
          </Field>

          <label className={styles.check}>
            <input type="checkbox" checked={values.published} onChange={(e) => set('published', e.target.checked)} />
            <span>
              <strong>Publicado</strong> — si lo destildás queda como borrador y no aparece en la web
            </span>
          </label>
        </div>

        <div className={styles.formSide}>
          <Field label="Foto (opcional)" error={errors.image} hint="JPG, PNG o WebP, hasta 3 MB">
            {(props) => (
              <input
                {...props}
                type="file"
                accept={ACCEPTED_PHOTOS}
                className={styles.file}
                onChange={(e) => {
                  setPhoto(e.target.files?.[0] ?? null)
                  setRemovePhoto(false)
                }}
              />
            )}
          </Field>
          <div className={styles.preview}>
            {currentImage ? <img src={currentImage} alt="Vista previa de la foto del evento" /> : <span>Sin foto</span>}
          </div>
          {event?.imageUrl && !photo && !removePhoto ? (
            <button type="button" className={styles.ghost} onClick={() => setRemovePhoto(true)}>
              Quitar foto
            </button>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p role="alert" className={styles.formError}>
          {formError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar evento'}
        </button>
      </div>
    </form>
  )
}
