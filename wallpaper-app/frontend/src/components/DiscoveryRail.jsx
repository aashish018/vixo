import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import WallpaperCard from './WallpaperCard.jsx'
import styles from './DiscoveryRail.module.css'

export default function DiscoveryRail({ title, subtitle, items = [] }) {
  if (!items.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span className={styles.count}>{items.length} picks</span>
      </div>

      <div className={styles.rail}>
        {items.map((item, index) => (
          <div key={`${title}-${item.id}`} className={styles.tile}>
            <WallpaperCard wallpaper={item} priority={index < 2} compact />
          </div>
        ))}
      </div>

      <Link to="/" className={styles.link}>
        Keep exploring
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}
