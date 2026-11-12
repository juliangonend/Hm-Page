export interface ContactValues {
  name: string
  email: string
  motivo: string
  message: string
}

export type ContactField = keyof ContactValues
export type ContactErrors = Partial<Record<ContactField, string>>

export const MESSAGE_MAX_LENGTH = 500

export const CONTACT_ERRORS: Record<ContactField, string> = {
  name: 'El nombre es obligatorio.',
  email: 'Ingresá un correo válido.',
  motivo: 'Seleccioná un motivo de consulta.',
  message: 'El mensaje no puede estar vacío.',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {}
  if (!values.name.trim()) errors.name = CONTACT_ERRORS.name
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = CONTACT_ERRORS.email
  if (!values.motivo.trim()) errors.motivo = CONTACT_ERRORS.motivo
  if (!values.message.trim()) errors.message = CONTACT_ERRORS.message
  return errors
}
