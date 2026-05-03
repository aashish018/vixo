import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink, Eye, Grid2x2, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { getWallpaper, trackDownload } from '../utils/api.js'
import styles from './WallpaperDetailPage.module.css'

export default function WallpaperDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wallpaper, setWallpaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getWallpaper(id)
      .then(data => {
        if (!cancelled) setWallpaper(data)
      })
      .catch(error => {
        if (!cancelled) {
          toast.error(error.userMessage)
          setWallpaper(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const createdAt = useMemo(() => {
    if (!wallpaper?.createdAt) return 'Recently added'
    return new Date(wallpaper.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [wallpaper])

  const tags = wallpaper?.tags?.split(',').map(item => item.trim()).filter(Boolean) || []

  const handleDownload = async () => {
    if (!wallpaper) return
    setDownloading(true)
    try {
      const response = await trackDownload(wallpaper.id)
      const anchor = document.createElement('a')
      anchor.href = response.imageUrl
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      anchor.download = `${wallpaper.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    } catch (error) {
      toast.error(error.userMessage)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <span>Loading wallpaper</span>
      </div>
    )
  }

  if (!wallpaper) {
    return (
      <div className={styles.notFound}>
        <h1>Wallpaper not found</h1>
        <button type="button" className={styles.backButton} onClick={() => navigate('/')}>
          Back to collection
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <Link to={`/?category=${encodeURIComponent(wallpaper.category)}`} className={styles.categoryLink}>
          {wallpaper.category}
        </Link>
      </div>

      <div className={styles.layout}>
        <section className={styles.imagePanel}>
          <img src={wallpaper.imageUrl} alt={wallpaper.title} className={styles.image} />
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.badges}>
            {wallpaper.featured && <span className={styles.badge}>Featured</span>}
            <span className={styles.badgeSoft}>{createdAt}</span>
          </div>

          <h1>{wallpaper.title}</h1>
          <p className={styles.description}>
            {wallpaper.description || 'A high-resolution wallpaper optimized for polished desktop and mobile setups.'}
          </p>

          <div className={styles.stats}>
            <div>
              <Eye size={16} />
              <strong>{(wallpaper.viewCount || 0).toLocaleString()}</strong>
              <span>Views</span>
            </div>
            <div>
              <Download size={16} />
              <strong>{(wallpaper.downloadCount || 0).toLocaleString()}</strong>
              <span>Downloads</span>
            </div>
            <div>
              <Grid2x2 size={16} />
              <strong>{wallpaper.resolution || 'Auto'}</strong>
              <span>Resolution</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={handleDownload} disabled={downloading}>
              {downloading ? <div className="spinner" /> : <Download size={16} />}
              {downloading ? 'Starting download...' : 'Download original'}
            </button>
            <a href={wallpaper.imageUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
              <ExternalLink size={16} />
              Open full image
            </a>
          </div>

          {tags.length > 0 && (
            <div className={styles.tagsBlock}>
              <div className={styles.tagsTitle}>
                <Tag size={15} />
                Tags
              </div>
              <div className={styles.tags}>
                {tags.map(tag => (
                  <Link key={tag} to={`/?search=${encodeURIComponent(tag)}`} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
