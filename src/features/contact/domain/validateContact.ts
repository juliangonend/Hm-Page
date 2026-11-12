import { findCountry } from '../../../shared/domain/countries'

export interface ContactValues {
  name: string
  email: string
  country: string
  motivo: string
  message: string
}

export type ContactField = keyof ContactValues
export type ContactErrors = Partial<Record<ContactField, string>>

/** `email` asks for a reply address; `whatsapp` asks for the country, which picks the WhatsApp line. */
export type ContactChannel = 'email' | 'whatsapp'

export const MESSAGE_MAX_LENGTH = 500

export const CONTACT_ERRORS: Record<ContactField, string> = {
  name: 'El nombre es obligatorio.',
  email: 'Ingresá un correo válido.',
  country: 'Seleccioná tu país.',
  motivo: 'Seleccioná un motivo de consulta.',
  message: 'El mensaje no puede estar vacío.',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const validateContact = (values: ContactValues, channel: ContactChannel = 'email'): ContactErrors => {
  const errors: ContactErrors = {}
  if (!values.name.trim()) errors.name = CONTACT_ERRORS.name
  if (channel === 'email' && !EMAIL_PATTERN.test(values.email.trim())) errors.email = CONTACT_ERRORS.email
  if (channel === 'whatsapp' && !findCountry(values.country)) errors.country = CONTACT_ERRORS.country
  if (!values.motivo.trim()) errors.motivo = CONTACT_ERRORS.motivo
  if (!values.message.trim()) errors.message = CONTACT_ERRORS.message
  return errors
}

/** "Hola! Soy Ana (Argentina).\nMotivo: ARQUEROS\n\nQuiero entrenar" */
export const whatsappMessage = (values: ContactValues): string =>
  `Hola! Soy ${values.name.trim()} (${findCountry(values.country)?.label ?? values.country}).\nMotivo: ${values.motivo}\n\n${values.message.trim()}`
