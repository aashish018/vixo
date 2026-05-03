import { Link } from 'react-router-dom'
import { Layers3 } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Layers3 size={18} />
            </div>
            <div className={styles.brandTitle}>Wallpaper<span>Vault</span></div>
          </div>
          <p className={styles.copy}>
            A minimal wallpaper library with a calmer browsing rhythm, faster delivery, and production-ready uploads.
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/">Browse</Link>
          <Link to="/admin">Admin</Link>
        </div>

        <div className={styles.meta}>
          <span>© {new Date().getFullYear()} WallpaperVault</span>
          <span>Built for real users, responsive by default, optimized for moderate traffic.</span>
        </div>
      </div>
    </footer>
  )
}
