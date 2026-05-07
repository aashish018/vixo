import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Compass, Flame, ImageIcon, Shuffle, Sparkles } from 'lucide-react'
import { getFeatured, getWallpapers } from '../utils/api.js'
import WallpaperCard from '../components/WallpaperCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SortBar from '../components/SortBar.jsx'
import ColorFilterBar from '../components/ColorFilterBar.jsx'
import DiscoveryRail from '../components/DiscoveryRail.jsx'
import styles from './HomePage.module.css'
import {
  applyClientSideFilters,
  getDiscoverySections,
  getMoodCollections,
  getRecentSearches,
  saveRecentSearch,
} from '../utils/wallpaperMeta.js'

const PAGE_SIZE = 12

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'latest'
  const color = searchParams.get('color') || ''

  const [items, setItems] = useState([])
  const [featured, setFeatured] = useState([])
  const [nextPage, setNextPage] = useState(null)
  const [hasNext, setHasNext] = useState(true)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '0px 0px 700px 0px' })

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  useEffect(() => {
    getFeatured().then(setFeatured).catch(() => setFeatured([]))
  }, [])

  useEffect(() => {
    if (search) {
      saveRecentSearch(search)
      setRecentSearches(getRecentSearches())
    }
  }, [search])

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
    setLoadingMore(true)
  }, [inView, loading, loadingMore, hasNext, nextPage])

  useEffect(() => {
    if (loading || loadingMore || !hasNext || nextPage == null) return

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY
      const triggerPoint = document.documentElement.scrollHeight - 900
      if (scrollPosition >= triggerPoint) {
        setLoadingMore(current => current || true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [loading, loadingMore, hasNext, nextPage])

  useEffect(() => {
    if (!loadingMore || loading || !hasNext || nextPage == null) return

    let cancelled = false
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
  }, [loadingMore, loading, hasNext, nextPage, category, search, sort])

  const updateParam = (key, value) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  const filteredItems = useMemo(
    () => applyClientSideFilters(items, { color, mood: '' }),
    [items, color]
  )

  const headline = useMemo(() => {
    if (search) return `Results for "${search}"`
    if (category) return `${category} wallpapers`
    if (color) return `${color[0].toUpperCase()}${color.slice(1)} mood board`
    return 'A premium wallpaper platform built for visual retention'
  }, [category, search, color])

  const heroStats = [
    { label: 'Live collection', value: `${total || featured.length || 0}+`, icon: ImageIcon },
    { label: 'Curated delivery', value: 'Cloudinary', icon: Flame },
    { label: 'Immersive feel', value: 'Cinematic', icon: Compass },
  ]

  const discoverySections = useMemo(
    () => getDiscoverySections(filteredItems, featured),
    [filteredItems, featured]
  )

  const moodCollections = Object.entries(getMoodCollections()).slice(0, 10)

  const surpriseMe = () => {
    const pool = filteredItems.length ? filteredItems : items
    if (!pool.length) return
    const next = pool[Math.floor(Math.random() * pool.length)]
    navigate(`/wallpaper/${next.id}`)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>Immersive wallpaper discovery</div>
          <h1>{headline}</h1>
          <p>
            Explore a cinematic feed of desktop and mobile wallpapers with mood-first discovery, social-ready visuals, and a browsing rhythm designed to keep people scrolling.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryAction} onClick={surpriseMe}>
              <Shuffle size={16} />
              Surprise Me
            </button>
            <a href="#discover" className={styles.secondaryAction}>
              <Sparkles size={16} />
              Explore sections
            </a>
          </div>
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

      <section className={styles.collectionsStrip}>
        <div className={styles.stripHeader}>
          <div>
            <h2>Browse by mood</h2>
            <p>Curated emotional entry points built from the same live wallpaper inventory.</p>
          </div>
        </div>
        <div className={styles.collectionRow}>
          {moodCollections.map(([slug, entry]) => (
            <Link key={slug} to={`/collections/${slug}`} className={styles.collectionChip}>
              <span>{entry.title}</span>
              <small>{entry.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.filters}>
        <CategoryFilter selected={category || 'All'} onChange={value => updateParam('category', value)} />
        <ColorFilterBar activeColor={color} onChange={value => updateParam('color', value)} />
        <SortBar sort={sort} onChange={value => updateParam('sort', value)} total={filteredItems.length || total} />
      </div>

      {recentSearches.length > 0 && !search && (
        <section className={styles.recentSearches}>
          <div className={styles.recentLabel}>Recent searches</div>
          <div className={styles.recentRow}>
            {recentSearches.map(item => (
              <button key={item} type="button" className={styles.recentChip} onClick={() => updateParam('search', item)}>
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      <div id="discover" className={styles.discoveryStack}>
        {discoverySections.map(section => (
          <DiscoveryRail key={section.key} title={section.title} subtitle="Editorially grouped from the live feed" items={section.items} />
        ))}
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

      {!error && !loading && filteredItems.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No wallpapers yet</h2>
          <p>Try another search, category, or color to widen the collection.</p>
        </div>
      )}

      {!error && filteredItems.length > 0 && (
        <>
          <section className={styles.feedHeader}>
            <div>
              <div className={styles.feedKicker}>Main feed</div>
              <h2>Dense visual browsing</h2>
            </div>
            <p>Variable heights, lazy loading, and continuous discovery built for mobile-first scrolling.</p>
          </section>

          <section className={styles.grid}>
            {filteredItems.map((wallpaper, index) => (
              <WallpaperCard key={`${wallpaper.id}-${index}`} wallpaper={wallpaper} priority={index < 6} />
            ))}
          </section>

          <div ref={ref} className={styles.loadMore}>
            {loadingMore && (
              <>
                <div className={`${styles.loadBar} skeleton`} />
                <span>Loading more wallpapers...</span>
              </>
            )}
            {!hasNext && <span>You reached the end of the collection.</span>}
          </div>
        </>
      )}
    </div>
  )
}
