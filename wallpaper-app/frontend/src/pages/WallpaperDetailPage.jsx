import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getWallpaper, trackDownload } from '../utils/api.js'
import toast from 'react-hot-toast'
import styles from './WallpaperDetailPage.module.css'
import {
  Download, ArrowLeft, Tag, Monitor, Eye,
  TrendingDown, Star, Calendar, ExternalLink
} from 'lucide-react'

export default function WallpaperDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wallpaper, setWallpaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setImgLoaded(false)
    getWallpaper(id)
      .then(setWallpaper)
      .catch(() => toast.error('Wallpaper not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    if (!wallpaper) return
    setDownloading(true)
    try {
      await trackDownload(wallpaper.id)

      // Download via anchor
      const a = document.createElement('a')
      a.href = wallpaper.imageUrl
      a.download = `${wallpaper.title.replace(/\s+/g,'_')}.jpg`
      a.target = '_blank'
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast.success('Download started!')
    } catch {
      toast.error('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className="spinner" />
        <p>Loading wallpaper...</p>
      </div>
    )
  }

  if (!wallpaper) {
    return (
      <div className={styles.notFound}>
        <h2>Wallpaper not found</h2>
        <Link to="/" className={styles.backBtn}><ArrowLeft size={16}/> Back to gallery</Link>
      </div>
    )
  }

  const tags = wallpaper.tags ? wallpaper.tags.split(',').map(t => t.trim()) : []
  const createdDate = wallpaper.createdAt
    ? new Date(wallpaper.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : null

  // Update document title / meta for SEO
  document.title = `${wallpaper.title} — WallpaperVault`

  return (
    <div className={styles.page}>
      {/* Back */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <Link
          to={`/?category=${encodeURIComponent(wallpaper.category)}`}
          className={styles.categoryLink}
        >
          {wallpaper.category}
        </Link>
      </div>

      <div className={styles.layout}>
        {/* Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            {!imgLoaded && <div className={`${styles.imgSkeleton} skeleton`} />}
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className={`${styles.image} ${imgLoaded ? styles.imgVisible : ''}`}
              onLoad={() => setImgLoaded(true)}
              onError={e => { e.target.style.opacity = 1 }}
            />
          </div>

          {/* Ad slot beside/below image */}
          <div className={styles.adSlot}>
            📢 Ad Placeholder (300×250) — Replace with AdSense
          </div>
        </div>

        {/* Info panel */}
        <div className={styles.panel}>
          {wallpaper.featured && (
            <div className={styles.featuredBadge}>
              <Star size={12} /> Featured
            </div>
          )}

          <h1 className={styles.title}>{wallpaper.title}</h1>

          {wallpaper.description && (
            <p className={styles.description}>{wallpaper.description}</p>
          )}

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <Eye size={15} /> <span>{(wallpaper.viewCount || 0).toLocaleString()}</span>
              <small>Views</small>
            </div>
            <div className={styles.stat}>
              <Download size={15} /> <span>{(wallpaper.downloadCount || 0).toLocaleString()}</span>
              <small>Downloads</small>
            </div>
            {wallpaper.resolution && (
              <div className={styles.stat}>
                <Monitor size={15} /> <span>{wallpaper.resolution}</span>
                <small>Resolution</small>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className={styles.meta}>
            {createdDate && (
              <div className={styles.metaRow}>
                <Calendar size={14} /> <span>{createdDate}</span>
              </div>
            )}
            <div className={styles.metaRow}>
              <Monitor size={14} />
              <Link to={`/?category=${encodeURIComponent(wallpaper.category)}`} className={styles.catLink}>
                {wallpaper.category}
              </Link>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className={styles.tagsSection}>
              <div className={styles.tagsLabel}><Tag size={13} /> Tags</div>
              <div className={styles.tags}>
                {tags.map(t => (
                  <Link
                    key={t}
                    to={`/?search=${encodeURIComponent(t)}`}
                    className={styles.tag}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div className={styles.actions}>
            <button
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? <div className="spinner" /> : <Download size={18} />}
              {downloading ? 'Downloading...' : 'Download HD'}
            </button>

            <a
              href={wallpaper.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openBtn}
            >
              <ExternalLink size={16} /> Open Original
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
