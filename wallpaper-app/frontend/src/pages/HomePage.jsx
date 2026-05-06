import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Compass, Flame, ImageIcon } from 'lucide-react'
import { getFeatured, getWallpapers } from '../utils/api.js'
import WallpaperCard from '../components/WallpaperCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SortBar from '../components/SortBar.jsx'
import styles from './HomePage.module.css'

const PAGE_SIZE = 12

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'latest'

  const [items, setItems] = useState([])
  const [featured, setFeatured] = useState([])
  const [nextPage, setNextPage] = useState(null)
  const [hasNext, setHasNext] = useState(true)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const { ref, inView } = useInView({ threshold: 0.2 })

  useEffect(() => {
    getFeatured().then(setFeatured).catch(() => setFeatured([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setItems([])
    setNextPage(null)
    setHasNext(true)

    getWallpapers({ category, search, sort, page: 0, size: PAGE_SIZE })
      .then(data => {
        if (cancelled) return
        setItems(data.content || [])
        setHasNext(Boolean(data.hasNext))
        setNextPage(data.nextPage ?? null)
        setTotal(data.totalElements || 0)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.userMessage)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, search, sort])

  useEffect(() => {
    if (!inView || loading || loadingMore || !hasNext || nextPage == null) return

    let cancelled = false
    setLoadingMore(true)

    getWallpapers({ category, search, sort, page: nextPage, size: PAGE_SIZE })
      .then(data => {
        if (cancelled) return
        setItems(previous => [...previous, ...(data.content || [])])
        setHasNext(Boolean(data.hasNext))
        setNextPage(data.nextPage ?? null)
        setTotal(data.totalElements || 0)
      })
      .catch(err => {
        if (!cancelled) setError(err.userMessage)
      })
      .finally(() => {
        if (!cancelled) setLoadingMore(false)
      })

    return () => {
      cancelled = true
    }
  }, [inView, loading, loadingMore, hasNext, nextPage, category, search, sort])

  const updateParam = (key, value) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  const headline = useMemo(() => {
    if (search) return `Results for "${search}"`
    if (category) return `${category} wallpapers`
    return 'Curated wallpapers with a premium feel'
  }, [category, search])

  const heroStats = [
    { label: 'Live collection', value: `${total || featured.length || 0}+`, icon: ImageIcon },
    { label: 'Curated delivery', value: 'Cloudinary', icon: Flame },
    { label: 'Browsing feel', value: 'Editorial', icon: Compass },
  ]

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>Modern wallpaper discovery</div>
          <h1>{headline}</h1>
          <p>
            A quieter, more image-first gallery for cinematic backgrounds, minimal compositions, and desktop-worthy visuals that feel collected, not cluttered.
          </p>
          <div className={styles.heroStats}>
            {heroStats.map(({ label, value, icon: Icon }) => (
              <div key={label} className={styles.heroStat}>
                <Icon size={16} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.heroPanelLabel}>Featured drop</div>
          {featured.length > 0 ? (
            featured.slice(0, 3).map(item => (
              <Link key={item.id} to={`/wallpaper/${item.id}`} className={styles.featuredItem}>
                <img src={item.thumbnailUrl || item.imageUrl} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            ))
          ) : (
            <div className={`${styles.featuredSkeleton} skeleton`} />
          )}
        </div>
      </section>

      <div className={styles.filters}>
        <CategoryFilter selected={category || 'All'} onChange={value => updateParam('category', value)} />
        <SortBar sort={sort} onChange={value => updateParam('sort', value)} total={total} />
      </div>

      {error && (
        <div className={styles.errorCard}>
          <h2>We could not load the gallery</h2>
          <p>{error}</p>
        </div>
      )}

      {!error && loading && (
        <section className={styles.grid}>
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className={styles.skeletonTile}>
              <div className={`${styles.skeletonMedia} skeleton`} />
              <div className={`${styles.skeletonText} skeleton`} />
            </div>
          ))}
        </section>
      )}

      {!error && !loading && items.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No wallpapers yet</h2>
          <p>Try another search or category to widen the collection.</p>
        </div>
      )}

      {!error && items.length > 0 && (
        <>
          <section className={styles.grid}>
            {items.map((wallpaper, index) => (
              <WallpaperCard key={`${wallpaper.id}-${index}`} wallpaper={wallpaper} priority={index < 4} />
            ))}
          </section>

          <div ref={ref} className={styles.loadMore}>
            {loadingMore && Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${styles.loadBar} skeleton`} />
            ))}
            {!hasNext && <span>You reached the end of the collection.</span>}
          </div>
        </>
      )}
    </div>
  )
}
