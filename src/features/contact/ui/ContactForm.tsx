import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { INLINE_MOTIVOS, MOTIVOS } from '../domain/motivos'
import { COUNTRIES, findCountry } from '../../../shared/domain/countries'
import {
  MESSAGE_MAX_LENGTH,
  validateContact,
  whatsappMessage,
  type ContactChannel,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../domain/validateContact'
import { sendWithEmailJs, type ContactSender } from '../infrastructure/emailJsSender'
import { Button } from '../../../shared/ui/Button'
import { whatsappUrl } from '../../../shared/lib/whatsapp'
import { cx } from '../../../shared/lib/cx'
import styles from './ContactForm.module.css'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

export const SUCCESS_CLOSE_DELAY_MS = 3000

interface ContactFormProps {
  /** `modal`: motivo as a select + Cancelar button. `inline`: motivo as chips. */
  variant: 'modal' | 'inline'
  /** `email` (default) sends through `sender`; `whatsapp` opens a chat with the country's line. */
  channel?: ContactChannel
  sender?: ContactSender
  /** How the WhatsApp chat is opened; injectable for tests. */
  openUrl?: (url: string) => void
  initialMotivo?: string
  initialMessage?: string
  initialCountry?: string
  onCancel?: () => void
  /** Called 3s after a successful submission. */
  onSent?: () => void
}

const EMPTY: ContactValues = { name: '', email: '', country: '', motivo: '', message: '' }
const ALL_TOUCHED: Record<ContactField, boolean> = { name: true, email: true, country: true, motivo: true, message: true }

const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const ContactForm = ({
  variant,
  channel = 'email',
  sender = sendWithEmailJs,
  openUrl = openInNewTab,
  initialMotivo = '',
  initialMessage = '',
  initialCountry = '',
  onCancel,
  onSent,
}: ContactFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const uid = useId()
  const fieldId = (field: string) => `${uid}-${field}`
  const [values, setValues] = useState<ContactValues>({ ...EMPTY, motivo: initialMotivo, message: initialMessage, country: initialCountry })
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<SendStatus>('idle')

  const errors: ContactErrors = validateContact(values, channel)
  const visibleError = (field: ContactField) => (touched[field] ? errors[field] : undefined)

  useEffect(() => {
    if (status !== 'success') return
    const timer = window.setTimeout(() => {
      if (onSent) onSent()
      else {
        setValues(EMPTY)
        setTouched({})
        setStatus('idle')
      }
    }, SUCCESS_CLOSE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [status, onSent])

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = event.target.dataset.field as ContactField
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    if (field === 'motivo' || field === 'country') setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const onBlur = (field: ContactField) => () => setTouched((prev) => ({ ...prev, [field]: true }))

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(ALL_TOUCHED)
    if (Object.keys(errors).length > 0 || !formRef.current || status === 'sending') {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      firstInvalid?.focus()
      return
    }
    const country = findCountry(values.country)
    if (channel === 'whatsapp' && country) {
      openUrl(whatsappUrl(country.whatsapp, whatsappMessage(values)))
      setStatus('success')
      return
    }
    setStatus('sending')
    try {
      await sender(formRef.current)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldProps = (field: ContactField) => {
    const error = visibleError(field)
    return {
      id: fieldId(field),
      'data-field': field,
      value: values[field],
      onChange,
      onBlur: onBlur(field),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? fieldId(`${field}-error`) : undefined,
      className: cx(styles.control, error && styles.invalid),
    }
  }

  const errorText = (field: ContactField) => {
    const error = visibleError(field)
    return error ? (
      <p id={fieldId(`${field}-error`)} className={styles.error}>
        {error}
      </p>
    ) : null
  }

  return (
    <form ref={formRef} className={cx(styles.form, styles[variant])} onSubmit={onSubmit} noValidate>
      {status === 'success' && (
        <div className={cx(styles.banner, styles.bannerSuccess)} role="status">
          {channel === 'whatsapp' ? (
            <>
              <strong>¡Listo! Te abrimos WhatsApp</strong>
              <span>Enviá el mensaje desde ahí y te respondemos a la brevedad.</span>
            </>
          ) : (
            <>
              <strong>¡Formulario enviado correctamente!</strong>
              <span>Te escribimos en menos de 48 h.</span>
            </>
          )}
        </div>
      )}
      {status === 'error' && (
        <div className={cx(styles.banner, styles.bannerError)} role="alert">
          <strong>Error al enviar el formulario</strong>
          <span>Revisá tu conexión e intentá de nuevo, o escribinos por WhatsApp.</span>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={fieldId('name')} className={styles.label}>
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input type="text" name="user_nombre" placeholder="Tu nombre" autoComplete="name" required {...fieldProps('name')} />
          {errorText('name')}
        </div>

        {channel === 'whatsapp' ? (
          <div className={styles.field}>
            <label htmlFor={fieldId('country')} className={styles.label}>
              País <span aria-hidden="true">*</span>
            </label>
            <select name="user_country" required {...fieldProps('country')}>
              <option value="" disabled>
                Seleccioná tu país
              </option>
              {COUNTRIES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            {errorText('country')}
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor={fieldId('email')} className={styles.label}>
              Correo <span aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              name="user_email"
              placeholder="email@email.com"
              autoComplete="email"
              inputMode="email"
              required
              {...fieldProps('email')}
            />
            {errorText('email')}
          </div>
        )}
      </div>

      {variant === 'modal' ? (
        <div className={styles.field}>
          <label htmlFor={fieldId('motivo')} className={styles.label}>
            Motivo de consulta <span aria-hidden="true">*</span>
          </label>
          <select name="user_motivo" required {...fieldProps('motivo')}>
            <option value="" disabled>
              Seleccioná un motivo
            </option>
            {MOTIVOS.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
          {errorText('motivo')}
        </div>
      ) : (
        <fieldset
          className={styles.fieldset}
          aria-invalid={visibleError('motivo') ? true : undefined}
          aria-describedby={visibleError('motivo') ? fieldId('motivo-error') : undefined}
        >
          <legend className={styles.label}>
            Motivo <span aria-hidden="true">*</span>
          </legend>
          <div className={styles.chips}>
            {INLINE_MOTIVOS.map(({ label, value }) => (
              <label key={value} className={cx(styles.chip, values.motivo === value && styles.chipActive)}>
                <input
                  type="radio"
                  name="user_motivo"
                  value={value}
                  data-field="motivo"
                  checked={values.motivo === value}
                  onChange={onChange}
                  className="visually-hidden"
                />
                {label}
              </label>
            ))}
          </div>
          {errorText('motivo')}
        </fieldset>
      )}

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor={fieldId('message')} className={styles.label}>
            Mensaje <span aria-hidden="true">*</span>
          </label>
          <span className={styles.counter} aria-live="polite">
            {values.message.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <textarea
          name="message"
          rows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Contanos qué estás buscando"
          required
          {...fieldProps('message')}
        />
        {errorText('message')}
      </div>

      <div className={styles.actions}>
        {variant === 'modal' && onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={status === 'sending'} block={variant === 'inline'}>
          {status === 'sending' ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Enviando…
            </>
          ) : (
            'ENVIAR'
          )}
        </Button>
      </div>
    </form>
  )
}
