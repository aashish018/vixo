import { useState, useEffect, useRef } from 'react'
import {
  createWallpaper, uploadWallpaper, deleteWallpaper, getWallpapers
} from '../utils/api.js'
import toast from 'react-hot-toast'
import styles from './AdminPage.module.css'
import { Plus, Trash2, Link, Upload, Image, X, Check, AlertTriangle } from 'lucide-react'

const CATEGORIES = ['Nature', 'Urban', 'AI Art', 'AMOLED', 'Minimal', 'Bikes', 'Space', 'Abstract', 'Architecture', 'Animals', 'Other']
const EMPTY_FORM = { title: '', imageUrl: '', thumbnailUrl: '', category: '', tags: '', resolution: '', description: '', featured: false }

export default function AdminPage() {
  const [tab, setTab] = useState('url')           // 'url' | 'file'
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [wallpapers, setWallpapers] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileRef = useRef()

  // Load wallpapers
  const loadWallpapers = () => {
    setLoadingList(true)
    getWallpapers({ size: 50, sort: 'latest' })
      .then(d => setWallpapers(d.content || []))
      .catch(() => toast.error('Failed to load wallpapers'))
      .finally(() => setLoadingList(false))
  }

  useEffect(() => { loadWallpapers() }, [])

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.category) return toast.error('Category is required')

    if (tab === 'url' && !form.imageUrl.trim()) return toast.error('Image URL is required')
    if (tab === 'file' && !file) return toast.error('Please select an image file')

    setSubmitting(true)
    try {
      if (tab === 'url') {
        await createWallpaper(form)
      } else {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('title', form.title)
        fd.append('category', form.category)
        if (form.tags) fd.append('tags', form.tags)
        if (form.resolution) fd.append('resolution', form.resolution)
        if (form.description) fd.append('description', form.description)
        fd.append('featured', form.featured)
        await uploadWallpaper(fd)
      }
      toast.success('Wallpaper added!')
      setForm(EMPTY_FORM)
      clearFile()
      loadWallpapers()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.title || 'Failed to add wallpaper'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteWallpaper(id)
      toast.success('Wallpaper deleted')
      setDeleteConfirm(null)
      loadWallpapers()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Manage wallpapers — add via URL or file upload</p>
      </div>

      <div className={styles.layout}>
        {/* Add Form */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}><Plus size={18} /> Add Wallpaper</h2>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'url' ? styles.tabActive : ''}`} onClick={() => setTab('url')}>
              <Link size={15} /> Image URL
            </button>
            <button className={`${styles.tab} ${tab === 'file' ? styles.tabActive : ''}`} onClick={() => setTab('file')}>
              <Upload size={15} /> File Upload
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Title */}
            <div className={styles.field}>
              <label className={styles.label}>Title *</label>
              <input
                className={styles.input}
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="e.g. Sunset Mountains"
              />
            </div>

            {/* URL or File */}
            {tab === 'url' ? (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Image URL *</label>
                  <input
                    className={styles.input}
                    value={form.imageUrl}
                    onChange={e => setField('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-...?w=1920&q=80"
                    type="url"
                  />
                  <span className={styles.hint}>Works with Unsplash, GitHub raw, or any direct image link</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Thumbnail URL <em>(optional — defaults to imageUrl)</em></label>
                  <input
                    className={styles.input}
                    value={form.thumbnailUrl}
                    onChange={e => setField('thumbnailUrl', e.target.value)}
                    placeholder="https://... (smaller/lower-res version)"
                    type="url"
                  />
                </div>
                {form.imageUrl && (
                  <div className={styles.urlPreview}>
                    <Image size={14} /> Preview:
                    <img src={form.imageUrl} alt="preview" onError={e => e.target.style.display='none'} />
                  </div>
                )}
              </>
            ) : (
              <div
                className={`${styles.dropzone} ${preview ? styles.dropzoneHasFile : ''}`}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => !preview && fileRef.current?.click()}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className={styles.dropPreview} />
                    <div className={styles.dropInfo}>
                      <span>{file?.name}</span>
                      <button type="button" className={styles.clearFile} onClick={clearFile}><X size={14} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={28} color="var(--text3)" />
                    <p>Drag & drop an image or <span>browse</span></p>
                    <small>JPG, PNG, WEBP — up to 50MB</small>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
              </div>
            )}

            {/* Category */}
            <div className={styles.field}>
              <label className={styles.label}>Category *</label>
              <select
                className={styles.select}
                value={form.category}
                onChange={e => setField('category', e.target.value)}
              >
                <option value="">— Select category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div className={styles.field}>
              <label className={styles.label}>Tags <em>(comma separated)</em></label>
              <input
                className={styles.input}
                value={form.tags}
                onChange={e => setField('tags', e.target.value)}
                placeholder="mountains, sunset, nature, 4k"
              />
            </div>

            {/* Resolution */}
            <div className={styles.field}>
              <label className={styles.label}>Resolution</label>
              <input
                className={styles.input}
                value={form.resolution}
                onChange={e => setField('resolution', e.target.value)}
                placeholder="1920x1080"
              />
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Short description of the wallpaper..."
                rows={3}
              />
            </div>

            {/* Featured */}
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setField('featured', e.target.checked)}
                className={styles.checkbox}
              />
              <span><Check size={12} /> Mark as Featured</span>
            </label>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? <><div className="spinner" /> Saving...</> : <><Plus size={16}/> Add Wallpaper</>}
            </button>
          </form>
        </div>

        {/* Wallpaper list */}
        <div className={styles.listCard}>
          <h2 className={styles.cardTitle}>
            All Wallpapers
            <span className={styles.count}>{wallpapers.length}</span>
          </h2>

          {loadingList ? (
            <div className={styles.listLoading}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} className={`${styles.skeletonRow} skeleton`} />
              ))}
            </div>
          ) : wallpapers.length === 0 ? (
            <p className={styles.empty}>No wallpapers yet. Add one!</p>
          ) : (
            <div className={styles.list}>
              {wallpapers.map(w => (
                <div key={w.id} className={styles.listItem}>
                  <img
                    src={w.thumbnailUrl || w.imageUrl}
                    alt={w.title}
                    className={styles.thumb}
                    onError={e => e.target.style.background='var(--surface)'}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{w.title}</span>
                    <span className={styles.itemMeta}>{w.category} · {w.resolution || 'No resolution'}</span>
                  </div>

                  {deleteConfirm === w.id ? (
                    <div className={styles.confirmRow}>
                      <AlertTriangle size={14} color="var(--danger)" />
                      <button className={styles.confirmYes} onClick={() => handleDelete(w.id)}>Yes</button>
                      <button className={styles.confirmNo} onClick={() => setDeleteConfirm(null)}>No</button>
                    </div>
                  ) : (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteConfirm(w.id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
