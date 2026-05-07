import { useMemo, useState } from 'react'
import ModalShell from './ModalShell.jsx'
import { getWallpaperDeviceSuggestions } from '../utils/wallpaperMeta.js'
import styles from './DownloadModal.module.css'

export default function DownloadModal({ open, wallpaper, onClose, onDownload }) {
  const options = useMemo(() => getWallpaperDeviceSuggestions(wallpaper), [wallpaper])
  const [selected, setSelected] = useState(options[0]?.key)

  if (!wallpaper) return null

  const activeOption = options.find(option => option.key === selected) || options[0]

  return (
    <ModalShell open={open} title="Download for my device" onClose={onClose}>
      <div className={styles.body}>
        <p className={styles.copy}>
          We detected a premium fit for your screen. Choose a target to start the download.
        </p>
        <div className={styles.pills}>
          {options.map(option => (
            <button
              key={option.key}
              type="button"
              className={`${styles.pill} ${selected === option.key ? styles.active : ''}`}
              onClick={() => setSelected(option.key)}
            >
              <strong>{option.label}</strong>
              <span>{option.value}</span>
            </button>
          ))}
        </div>
        <button type="button" className={styles.downloadButton} onClick={() => onDownload(activeOption)}>
          Download {activeOption.label}
        </button>
      </div>
    </ModalShell>
  )
}
