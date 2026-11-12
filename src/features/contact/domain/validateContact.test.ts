import { describe, expect, it } from 'vitest'
import { validateContact, whatsappMessage, CONTACT_ERRORS } from './validateContact'

const valid = { name: 'Ana', country: 'AR', motivo: 'JUGADORES', message: 'Hola' }

describe('validateContact', () => {
  it('accepts a complete form', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('requires every field', () => {
    expect(validateContact({ name: ' ', country: '', motivo: '', message: '  ' })).toEqual({
      name: CONTACT_ERRORS.name,
      country: CONTACT_ERRORS.country,
      motivo: CONTACT_ERRORS.motivo,
      message: CONTACT_ERRORS.message,
    })
  })

  it('rejects a country without a WhatsApp line', () => {
    expect(validateContact({ ...valid, country: 'BR' }).country).toBe(CONTACT_ERRORS.country)
  })
})

describe('whatsappMessage', () => {
  it('introduces the person with the country name, motivo and message', () => {
    expect(whatsappMessage({ ...valid, name: ' Ana ', message: ' Quiero entrenar ' })).toBe(
      'Hola! Soy Ana (Argentina).\nMotivo: JUGADORES\n\nQuiero entrenar',
    )
  })
})
