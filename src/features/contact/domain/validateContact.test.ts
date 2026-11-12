import { describe, expect, it } from 'vitest'
import { validateContact, CONTACT_ERRORS } from './validateContact'

const valid = { name: 'Ana', email: 'ana@mail.com', country: '', motivo: 'JUGADORES', message: 'Hola' }

describe('validateContact', () => {
  it('accepts a complete form', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('requires every field', () => {
    expect(validateContact({ name: ' ', email: '', country: '', motivo: '', message: '  ' })).toEqual({
      name: CONTACT_ERRORS.name,
      email: CONTACT_ERRORS.email,
      motivo: CONTACT_ERRORS.motivo,
      message: CONTACT_ERRORS.message,
    })
  })

  it.each(['ana', 'ana@', 'ana@mail', '@mail.com', 'ana mail@x.com'])('rejects invalid email %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toBe('Ingresá un correo válido.')
  })
})
