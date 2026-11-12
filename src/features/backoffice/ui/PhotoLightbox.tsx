import { useRef } from 'react'
import { useDialog } from '../../../shared/ui/useDialog'
import styles from './Admin.module.css'

interface PhotoLightboxProps {
  src: string
  onClose: () => void
}

export const PhotoLightbox = ({ src, onClose }: PhotoLightboxProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(panelRef, onClose)

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Foto completa"
        className={styles.lightboxPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.lightboxClose} onClick={onClose}>
          Cerrar
        </button>
        <img src={src} alt="Foto del evento en tamaño completo" />
      </div>
    </div>
  )
}
