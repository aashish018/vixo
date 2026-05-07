import { getColorSwatches } from '../utils/wallpaperMeta.js'
import styles from './ColorFilterBar.module.css'

export default function ColorFilterBar({ activeColor, onChange }) {
  const swatches = getColorSwatches()

  return (
    <section className={styles.section}>
      <div className={styles.label}>Palette</div>
      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.resetChip} ${!activeColor ? styles.activeReset : ''}`}
          onClick={() => onChange('')}
        >
          All tones
        </button>
        {swatches.map(swatch => (
          <button
            key={swatch.key}
            type="button"
            className={`${styles.swatchButton} ${activeColor === swatch.key ? styles.active : ''}`}
            onClick={() => onChange(swatch.key)}
            aria-label={`Filter by ${swatch.label}`}
            title={swatch.label}
          >
            <span className={styles.swatch} style={{ background: swatch.hex }} />
            <span>{swatch.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
