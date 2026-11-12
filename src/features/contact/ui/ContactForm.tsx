import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { INLINE_MOTIVOS, MOTIVOS } from '../domain/motivos'
import { COUNTRIES, findCountry } from '../../../shared/domain/countries'
import {
  MESSAGE_MAX_LENGTH,
  validateContact,
  whatsappMessage,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../domain/validateContact'
import { Button } from '../../../shared/ui/Button'
import { whatsappUrl } from '../../../shared/lib/whatsapp'
import { cx } from '../../../shared/lib/cx'
import styles from './ContactForm.module.css'

export const SUCCESS_CLOSE_DELAY_MS = 3000

interface ContactFormProps {
  /** `modal`: motivo as a select + Cancelar button. `inline`: motivo as chips. */
  variant: 'modal' | 'inline'
  /** How the WhatsApp chat is opened; injectable for tests. */
  openUrl?: (url: string) => void
  initialMotivo?: string
  initialMessage?: string
  initialCountry?: string
  onCancel?: () => void
  /** Called 3s after WhatsApp opens. */
  onSent?: () => void
}

const EMPTY: ContactValues = { name: '', country: '', motivo: '', message: '' }
const ALL_TOUCHED: Record<ContactField, boolean> = { name: true, country: true, motivo: true, message: true }

const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Collects the inquiry and opens WhatsApp, already written, with the line of the chosen country. */
export const ContactForm = ({
  variant,
  openUrl = openInNewTab,
  initialMotivo = '',
  initialMessage = '',
  initialCountry = '',
  onCancel,
  onSent,
}: ContactFormProps) => {
  const uid = useId()
  const fieldId = (field: string) => `${uid}-${field}`
  const [values, setValues] = useState<ContactValues>({ ...EMPTY, motivo: initialMotivo, message: initialMessage, country: initialCountry })
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [sent, setSent] = useState(false)

  const errors: ContactErrors = validateContact(values)
  const visibleError = (field: ContactField) => (touched[field] ? errors[field] : undefined)

  useEffect(() => {
    if (!sent) return
    const timer = window.setTimeout(() => {
      if (onSent) onSent()
      else {
        setValues(EMPTY)
        setTouched({})
        setSent(false)
      }
    }, SUCCESS_CLOSE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [sent, onSent])

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = event.target.dataset.field as ContactField
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    if (field === 'motivo' || field === 'country') setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const onBlur = (field: ContactField) => () => setTouched((prev) => ({ ...prev, [field]: true }))

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(ALL_TOUCHED)
    const country = findCountry(values.country)
    if (Object.keys(errors).length > 0 || !country) {
      event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    openUrl(whatsappUrl(country.whatsapp, whatsappMessage(values)))
    setSent(true)
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
    <form className={cx(styles.form, styles[variant])} onSubmit={onSubmit} noValidate>
      {sent && (
        <div className={cx(styles.banner, styles.bannerSuccess)} role="status">
          <strong>¡Listo! Te abrimos WhatsApp</strong>
          <span>Enviá el mensaje desde ahí y te respondemos a la brevedad.</span>
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
        <Button type="submit" block={variant === 'inline'}>
          ENVIAR
        </Button>
      </div>
    </form>
  )
}
