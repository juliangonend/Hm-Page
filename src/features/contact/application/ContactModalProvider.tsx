import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ContactModalContext } from './contactModalContext'
import { ContactModal } from '../ui/ContactModal'
import type { Motivo } from '../domain/motivos'
import type { CountryCode } from '../../../shared/domain/countries'

interface ModalState {
  open: boolean
  motivo?: Motivo
  message?: string
  country?: CountryCode
  /** Remounts the form on each opening so it starts clean. */
  session: number
}

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ModalState>({ open: false, session: 0 })

  const openContact = useCallback(
    (motivo?: Motivo, message?: string, country?: CountryCode) =>
      setState((prev) => ({ open: true, motivo, message, country, session: prev.session + 1 })),
    [],
  )
  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), [])
  const api = useMemo(() => ({ openContact }), [openContact])

  return (
    <ContactModalContext.Provider value={api}>
      {children}
      {state.open && (
        <ContactModal
          key={state.session}
          initialMotivo={state.motivo}
          initialMessage={state.message}
          initialCountry={state.country}
          onClose={close}
        />
      )}
    </ContactModalContext.Provider>
  )
}
