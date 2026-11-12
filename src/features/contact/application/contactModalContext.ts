import { createContext, useContext } from 'react'
import type { Motivo } from '../domain/motivos'
import type { CountryCode } from '../../../shared/domain/countries'

export interface ContactModalApi {
  /** Opens "Contactanos", optionally with the motivo, a message and the country already filled in. */
  openContact: (motivo?: Motivo, message?: string, country?: CountryCode) => void
}

export const ContactModalContext = createContext<ContactModalApi>({ openContact: () => undefined })

export const useContactModal = (): ContactModalApi => useContext(ContactModalContext)
