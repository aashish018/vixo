import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Eye, Grid2x2, Share2, Sparkles, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { getWallpaper, getWallpapers, trackDownload } from '../utils/api.js'
import WallpaperCard from '../components/WallpaperCard.jsx'
import DevicePreviewModal from '../components/DevicePreviewModal.jsx'
import DownloadModal from '../components/DownloadModal.jsx'
import ShareModal from '../components/ShareModal.jsx'
import styles from './WallpaperDetailPage.module.css'
import { getRelatedWallpapers, inferWallpaperColors, inferMoodTags } from '../utils/wallpaperMeta.js'

export default function WallpaperDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wallpaper, setWallpaper] = useState(null)
  const [relatedPool, setRelatedPool] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [activeFrame, setActiveFrame] = useState('iphone')

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      getWallpaper(id),
      getWallpapers({ page: 0, size: 36, sort: 'latest' }),
    ])
      .then(([wallpaperData, relatedData]) => {
        if (cancelled) return
        setWallpaper(wallpaperData)
        setRelatedPool(relatedData.content || [])
        document.title = `${wallpaperData.title} | WallpaperVault`
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', wallpaperData.description || `${wallpaperData.title} wallpaper on WallpaperVault`)
        }
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage) {
          ogImage.setAttribute('content', wallpaperData.imageUrl)
        }
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
  const colors = useMemo(() => inferWallpaperColors(wallpaper), [wallpaper])
  const moods = useMemo(() => inferMoodTags(wallpaper), [wallpaper])
  const related = useMemo(() => getRelatedWallpapers(wallpaper, relatedPool), [wallpaper, relatedPool])

  const startDownload = async () => {
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
      toast.success('Download started')
      setDownloadOpen(false)
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
            <button type="button" className={styles.primaryButton} onClick={() => setDownloadOpen(true)} disabled={downloading}>
              {downloading ? <div className="spinner" /> : <Download size={16} />}
              Download for my device
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setPreviewOpen(true)}>
              <Sparkles size={16} />
              Preview on device
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setShareOpen(true)}>
              <Share2 size={16} />
              Share
            </button>
          </div>

          <div className={styles.metaBlocks}>
            <div className={styles.tagsBlock}>
              <div className={styles.tagsTitle}><Tag size={15} /> Tags</div>
              <div className={styles.tags}>
                {tags.map(tag => (
                  <Link key={tag} to={`/?search=${encodeURIComponent(tag)}`} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.tagsBlock}>
              <div className={styles.tagsTitle}>Colors</div>
              <div className={styles.tags}>
                {colors.map(color => (
                  <Link key={color} to={`/?color=${encodeURIComponent(color)}`} className={styles.tag}>
                    {color}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.tagsBlock}>
              <div className={styles.tagsTitle}>Mood</div>
              <div className={styles.tags}>
                {moods.map(mood => (
                  <span key={mood} className={styles.tag}>
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>More like this</h2>
          <p>Related by category, color, and tags.</p>
        </div>
        <div className={styles.relatedRail}>
          {related.moreLikeThis.map(item => (
            <div key={item.id} className={styles.relatedTile}>
              <WallpaperCard wallpaper={item} compact />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>Same mood</h2>
          <p>Emotionally similar wallpapers from the current collection.</p>
        </div>
        <div className={styles.relatedRail}>
          {related.sameMood.map(item => (
            <div key={item.id} className={styles.relatedTile}>
              <WallpaperCard wallpaper={item} compact />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>Similar colors</h2>
          <p>Built from frontend color metadata and current tags.</p>
        </div>
        <div className={styles.relatedRail}>
          {related.similarColors.map(item => (
            <div key={item.id} className={styles.relatedTile}>
              <WallpaperCard wallpaper={item} compact />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>Similar tags</h2>
          <p>Simple similarity logic, no expensive AI needed.</p>
        </div>
        <div className={styles.relatedRail}>
          {related.similarTags.map(item => (
            <div key={item.id} className={styles.relatedTile}>
              <WallpaperCard wallpaper={item} compact />
            </div>
          ))}
        </div>
      </section>

      <DevicePreviewModal
        open={previewOpen}
        wallpaper={wallpaper}
        activeFrame={activeFrame}
        onFrameChange={setActiveFrame}
        onClose={() => setPreviewOpen(false)}
      />
      <DownloadModal
        open={downloadOpen}
        wallpaper={wallpaper}
        onClose={() => setDownloadOpen(false)}
        onDownload={startDownload}
      />
      <ShareModal open={shareOpen} wallpaper={wallpaper} onClose={() => setShareOpen(false)} />
    </div>
  )
}
