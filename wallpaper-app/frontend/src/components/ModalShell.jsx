import { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './ModalShell.module.css'

export default function ModalShell({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const handler = event => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={event => event.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
