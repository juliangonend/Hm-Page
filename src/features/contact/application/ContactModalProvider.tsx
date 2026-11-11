import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ContactModalContext } from './contactModalContext'
import { ContactModal } from '../ui/ContactModal'
import type { Motivo } from '../domain/motivos'

interface ModalState {
  open: boolean
  motivo?: Motivo
  /** Remounts the form on each opening so it starts clean. */
  session: number
}

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ModalState>({ open: false, session: 0 })

  const openContact = useCallback(
    (motivo?: Motivo) => setState((prev) => ({ open: true, motivo, session: prev.session + 1 })),
    [],
  )
  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), [])
  const api = useMemo(() => ({ openContact }), [openContact])

  return (
    <ContactModalContext.Provider value={api}>
      {children}
      {state.open && <ContactModal key={state.session} initialMotivo={state.motivo} onClose={close} />}
    </ContactModalContext.Provider>
  )
}
