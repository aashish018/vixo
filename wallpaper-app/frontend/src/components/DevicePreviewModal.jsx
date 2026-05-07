import ModalShell from './ModalShell.jsx'
import styles from './DevicePreviewModal.module.css'

const FRAMES = [
  { key: 'iphone', label: 'iPhone', className: 'phone' },
  { key: 'android', label: 'Android', className: 'android' },
  { key: 'desktop', label: 'Desktop', className: 'desktop' },
]

export default function DevicePreviewModal({ open, wallpaper, activeFrame, onFrameChange, onClose }) {
  if (!wallpaper) return null

  return (
    <ModalShell open={open} title="Preview on Device" onClose={onClose}>
      <div className={styles.body}>
        <div className={styles.tabs}>
          {FRAMES.map(frame => (
            <button
              key={frame.key}
              type="button"
              className={`${styles.tab} ${activeFrame === frame.key ? styles.active : ''}`}
              onClick={() => onFrameChange(frame.key)}
            >
              {frame.label}
            </button>
          ))}
        </div>

        <div className={styles.previewArea}>
          <div className={`${styles.frame} ${styles[activeFrame]}`}>
            <img src={wallpaper.imageUrl} alt={wallpaper.title} />
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
