import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, ImagePlus, Link2, Trash2, Upload, X } from 'lucide-react'
import { createWallpaper, deleteWallpaper, getWallpapers, uploadWallpaper } from '../utils/api.js'
import styles from './AdminPage.module.css'

const EMPTY_FORM = {
  title: '',
  imageUrl: '',
  category: '',
  tags: '',
  resolution: '',
  description: '',
  featured: false,
}

export default function AdminPage() {
  const [tab, setTab] = useState('url')
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [wallpapers, setWallpapers] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const fileInputRef = useRef(null)

  const loadWallpapers = () => {
    setLoadingList(true)
    getWallpapers({ page: 0, size: 18, sort: 'latest' })
      .then(data => setWallpapers(data.content || []))
      .catch(error => toast.error(error.userMessage))
      .finally(() => setLoadingList(false))
  }

  useEffect(() => {
    loadWallpapers()
  }, [])

  const setField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onFileSelect = nextFile => {
    if (!nextFile) return
    setFile(nextFile)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(nextFile))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitting(true)

    try {
      if (tab === 'url') {
        await createWallpaper(form)
      } else {
        if (!file) throw new Error('Please choose an image file first.')
        const payload = new FormData()
        payload.append('file', file)
        payload.append('title', form.title)
        payload.append('category', form.category)
        payload.append('tags', form.tags)
        payload.append('resolution', form.resolution)
        payload.append('description', form.description)
        payload.append('featured', String(form.featured))
        await uploadWallpaper(payload)
      }

      toast.success('Wallpaper published successfully.')
      setForm(EMPTY_FORM)
      clearFile()
      loadWallpapers()
    } catch (error) {
      toast.error(error.userMessage || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteWallpaper(id)
      toast.success('Wallpaper deleted.')
      loadWallpapers()
    } catch (error) {
      toast.error(error.userMessage)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Admin studio</div>
          <h1>Publish wallpapers into Cloudinary-backed storage</h1>
          <p>
            Import remote image URLs or upload files directly. Every publish request is validated by the backend and stored through Cloudinary.
          </p>
        </div>
        <div className={styles.tip}>
          <CheckCircle2 size={18} />
          <span>Rate limiting, DTO validation, and paginated APIs are now part of the backend flow.</span>
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.formCard}>
          <div className={styles.tabRow}>
            <button type="button" className={`${styles.tab} ${tab === 'url' ? styles.activeTab : ''}`} onClick={() => setTab('url')}>
              <Link2 size={15} />
              Import by URL
            </button>
            <button type="button" className={`${styles.tab} ${tab === 'file' ? styles.activeTab : ''}`} onClick={() => setTab('file')}>
              <Upload size={15} />
              Upload file
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Title</span>
              <input value={form.title} onChange={event => setField('title', event.target.value)} required maxLength={120} />
            </label>

            {tab === 'url' ? (
              <label className={styles.field}>
                <span>Source image URL</span>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={event => setField('imageUrl', event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </label>
            ) : (
              <div className={styles.uploadArea}>
                {preview ? <img src={preview} alt="Upload preview" className={styles.preview} /> : <ImagePlus size={28} />}
                <div>
                  <strong>{file ? file.name : 'Select an image to upload'}</strong>
                  <p>JPG, PNG, or WEBP up to 15 MB</p>
                </div>
                <div className={styles.uploadActions}>
                  <button type="button" onClick={() => fileInputRef.current?.click()}>Choose file</button>
                  {file && (
                    <button type="button" onClick={clearFile} className={styles.ghostButton}>
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={event => onFileSelect(event.target.files?.[0])}
                />
              </div>
            )}

            <label className={styles.field}>
              <span>Category</span>
              <input value={form.category} onChange={event => setField('category', event.target.value)} required maxLength={80} />
            </label>

            <label className={styles.field}>
              <span>Tags</span>
              <input value={form.tags} onChange={event => setField('tags', event.target.value)} placeholder="nature, cinematic, 4k" />
            </label>

            <label className={styles.field}>
              <span>Resolution</span>
              <input value={form.resolution} onChange={event => setField('resolution', event.target.value)} placeholder="3840x2160" />
            </label>

            <label className={styles.field}>
              <span>Description</span>
              <textarea value={form.description} onChange={event => setField('description', event.target.value)} rows={4} />
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={event => setField('featured', event.target.checked)}
              />
              Mark as featured
            </label>

            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? <div className="spinner" /> : <Upload size={16} />}
              {submitting ? 'Publishing...' : 'Publish wallpaper'}
            </button>
          </form>
        </section>

        <section className={styles.libraryCard}>
          <div className={styles.libraryHeader}>
            <h2>Recent uploads</h2>
            <span>{wallpapers.length} loaded</span>
          </div>

          {loadingList ? (
            <div className={styles.libraryLoading}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`${styles.loadingRow} skeleton`} />
              ))}
            </div>
          ) : (
            <div className={styles.libraryList}>
              {wallpapers.map(item => (
                <article key={item.id} className={styles.libraryItem}>
                  <img src={item.thumbnailUrl || item.imageUrl} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.category} · {item.resolution || 'Resolution pending'}</p>
                  </div>
                  <button type="button" className={styles.deleteButton} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
