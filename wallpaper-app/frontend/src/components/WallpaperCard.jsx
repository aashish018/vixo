import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Eye, Star } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { getAspectRatioHint, inferWallpaperColors } from '../utils/wallpaperMeta.js'
import styles from './WallpaperCard.module.css'

export default function WallpaperCard({ wallpaper, priority = false, compact = false }) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })
  const ratio = getAspectRatioHint(wallpaper)
  const palette = inferWallpaperColors(wallpaper)

  return (
    <article ref={ref} className={`${styles.card} ${compact ? styles.compactCard : ''}`}>
      <Link to={`/wallpaper/${wallpaper.id}`} className={styles.media}>
        <div
          className={styles.blurLayer}
          style={{
            backgroundImage: `url(${wallpaper.thumbnailUrl || wallpaper.imageUrl})`,
            aspectRatio: ratio === 'portrait' ? '4 / 5.3' : ratio === 'square' ? '1 / 1' : '4 / 3',
          }}
        />
        {!loaded && <div className={`${styles.skeleton} skeleton`} />}
        {(inView || priority) && (
          <img
            src={hasError ? wallpaper.imageUrl : wallpaper.thumbnailUrl || wallpaper.imageUrl}
            alt={wallpaper.title}
            loading="lazy"
            className={`${styles.image} ${loaded ? styles.visible : ''}`}
            style={{ aspectRatio: ratio === 'portrait' ? '4 / 5.3' : ratio === 'square' ? '1 / 1' : '4 / 3' }}
            onLoad={() => setLoaded(true)}
            onError={() => {
              if (hasError) {
                setLoaded(true)
                return
              }
              setHasError(true)
            }}
          />
        )}
        <div className={styles.overlay}>
          <div className={styles.topRow}>
            <div className={styles.category}>{wallpaper.category}</div>
            {wallpaper.featured && (
              <div className={styles.featured}>
                <Star size={12} />
                Featured
              </div>
            )}
          </div>

          <div className={styles.bottomBlock}>
            <div className={styles.palette}>
              {palette.slice(0, 3).map(color => (
                <span key={color} className={styles.colorDot} data-color={color} />
              ))}
            </div>
            <div className={styles.stats}>
              <span><Eye size={12} /> {(wallpaper.viewCount || 0).toLocaleString()}</span>
              <span><Download size={12} /> {(wallpaper.downloadCount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link to={`/wallpaper/${wallpaper.id}`} className={styles.title}>
          {wallpaper.title}
        </Link>
        {!compact && (
          <p className={styles.meta}>
            {wallpaper.resolution || 'High resolution'} · {wallpaper.description || 'Optimized for desktop and mobile screens'}
          </p>
        )}
      </div>
    </article>
  )
}
