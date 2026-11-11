import { createContext, useContext } from 'react'
import type { Motivo } from '../domain/motivos'

export interface ContactModalApi {
  openContact: (motivo?: Motivo) => void
}

export const ContactModalContext = createContext<ContactModalApi>({ openContact: () => undefined })

export const useContactModal = (): ContactModalApi => useContext(ContactModalContext)
