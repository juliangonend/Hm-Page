import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { ContactForm } from './ContactForm'
import { useDialog } from '../../../shared/ui/useDialog'
import styles from './ContactModal.module.css'

interface ContactModalProps {
  initialMotivo?: string
  initialMessage?: string
  initialCountry?: string
  onClose: () => void
}

export const ContactModal = ({ initialMotivo, initialMessage, initialCountry, onClose }: ContactModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(panelRef, onClose, 'input, select, textarea')

  return createPortal(
    <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-subtitle"
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <span className="eyebrow">HOCKEY MANAGEMENT</span>
        <h2 id="contact-modal-title" className={styles.title}>
          Contactanos
        </h2>
        <p id="contact-modal-subtitle" className={styles.subtitle}>
          Completá el formulario y te abrimos WhatsApp con tu consulta lista para enviar.
        </p>
        <ContactForm
          variant="modal"
          channel="whatsapp"
          initialMotivo={initialMotivo}
          initialMessage={initialMessage}
          initialCountry={initialCountry}
          onCancel={onClose}
          onSent={onClose}
        />
      </div>
    </div>,
    document.body,
  )
}
