import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getFeatured, getWallpapers } from '../utils/api.js'
import DiscoveryRail from '../components/DiscoveryRail.jsx'
import WallpaperCard from '../components/WallpaperCard.jsx'
import { filterByMood, getMoodCollections } from '../utils/wallpaperMeta.js'
import styles from './CollectionPage.module.css'

export default function CollectionPage() {
  const { slug } = useParams()
  const [items, setItems] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const collections = getMoodCollections()
  const collection = collections[slug]

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getWallpapers({ page: 0, size: 48, sort: 'latest' }),
      getFeatured(),
    ])
      .then(([wallpaperData, featuredData]) => {
        if (cancelled) return
        setItems(wallpaperData.content || [])
        setFeatured(featuredData || [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const filtered = useMemo(() => filterByMood(items, slug), [items, slug])

  if (!collection) {
    return (
      <div className={styles.empty}>
        <h1>Collection not found</h1>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className={styles.kicker}>Curated mood</div>
        <h1>{collection.title}</h1>
        <p>{collection.hero}</p>
      </section>

      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={`${styles.skeleton} skeleton`} />
          ))}
        </div>
      ) : (
        <>
          <section className={styles.grid}>
            {filtered.map((wallpaper, index) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} priority={index < 4} />
            ))}
          </section>
          <DiscoveryRail title="Featured inside this mood" subtitle={collection.description} items={featured.slice(0, 8)} />
        </>
      )}
    </div>
  )
}
