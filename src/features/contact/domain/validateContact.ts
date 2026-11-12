import { findCountry } from '../../../shared/domain/countries'

export interface ContactValues {
  name: string
  /** Country code; picks the WhatsApp line that answers */
  country: string
  motivo: string
  message: string
}

export type ContactField = keyof ContactValues
export type ContactErrors = Partial<Record<ContactField, string>>

export const MESSAGE_MAX_LENGTH = 500

export const CONTACT_ERRORS: Record<ContactField, string> = {
  name: 'El nombre es obligatorio.',
  country: 'Seleccioná tu país.',
  motivo: 'Seleccioná un motivo de consulta.',
  message: 'El mensaje no puede estar vacío.',
}

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {}
  if (!values.name.trim()) errors.name = CONTACT_ERRORS.name
  if (!findCountry(values.country)) errors.country = CONTACT_ERRORS.country
  if (!values.motivo.trim()) errors.motivo = CONTACT_ERRORS.motivo
  if (!values.message.trim()) errors.message = CONTACT_ERRORS.message
  return errors
}

/** "Hola! Soy Ana (Argentina).\nMotivo: ARQUEROS\n\nQuiero entrenar" */
export const whatsappMessage = (values: ContactValues): string =>
  `Hola! Soy ${values.name.trim()} (${findCountry(values.country)?.label ?? values.country}).\nMotivo: ${values.motivo}\n\n${values.message.trim()}`
