import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Eye, Tag } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import styles from './WallpaperCard.module.css'

export default function WallpaperCard({ wallpaper, index = 0 }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  const delay = Math.min(index % 6 * 0.05, 0.3)

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/wallpaper/${wallpaper.id}`} className={styles.imageWrapper}>
        {/* Skeleton */}
        {!loaded && !error && <div className={`${styles.skeleton} skeleton`} />}

        {/* Lazy image */}
        {inView && (
          <img
            src={error ? '/placeholder.svg' : wallpaper.thumbnailUrl || wallpaper.imageUrl}
            alt={wallpaper.title}
            className={`${styles.image} ${loaded ? styles.visible : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true); }}
            loading="lazy"
          />
        )}

        {/* Overlay */}
        <div className={styles.overlay}>
          <div className={styles.stats}>
            <span><Eye size={12} /> {(wallpaper.viewCount || 0).toLocaleString()}</span>
            <span><Download size={12} /> {(wallpaper.downloadCount || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Category badge */}
        <div className={styles.categoryBadge}>{wallpaper.category}</div>

        {/* Featured indicator */}
        {wallpaper.featured && <div className={styles.featured}>★ Featured</div>}
      </Link>

      <div className={styles.info}>
        <Link to={`/wallpaper/${wallpaper.id}`} className={styles.title}>
          {wallpaper.title}
        </Link>
        {wallpaper.tags && (
          <div className={styles.tags}>
            <Tag size={11} />
            {wallpaper.tags.split(',').slice(0,3).map(t => (
              <span key={t} className={styles.tag}>{t.trim()}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
