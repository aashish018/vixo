import toast from 'react-hot-toast'
import { Copy, PinIcon, Share2 } from 'lucide-react'
import ModalShell from './ModalShell.jsx'
import styles from './ShareModal.module.css'

export default function ShareModal({ open, wallpaper, onClose }) {
  if (!wallpaper) return null

  const pageUrl = window.location.href
  const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(wallpaper.imageUrl)}&description=${encodeURIComponent(wallpaper.title)}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl)
    toast.success('Link copied')
  }

  const nativeShare = async () => {
    if (!navigator.share) {
      copyLink()
      return
    }

    try {
      await navigator.share({
        title: wallpaper.title,
        text: wallpaper.description || wallpaper.title,
        url: pageUrl,
      })
    } catch {
      // user dismissed
    }
  }

  return (
    <ModalShell open={open} title="Share this wallpaper" onClose={onClose}>
      <div className={styles.body}>
        <a href={pinterestUrl} target="_blank" rel="noreferrer" className={styles.action}>
          <PinIcon size={16} />
          Share to Pinterest
        </a>
        <button type="button" className={styles.action} onClick={copyLink}>
          <Copy size={16} />
          Copy link
        </button>
        <button type="button" className={styles.action} onClick={nativeShare}>
          <Share2 size={16} />
          Share
        </button>
      </div>
    </ModalShell>
  )
}
