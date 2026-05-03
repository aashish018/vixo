import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getWallpapers } from '../utils/api.js'
import WallpaperCard from '../components/WallpaperCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SortBar from '../components/SortBar.jsx'
import styles from './HomePage.module.css'
import { ChevronLeft, ChevronRight, Frown } from 'lucide-react'

const PAGE_SIZE = 12

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [wallpapers, setWallpapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const sort     = searchParams.get('sort')      || 'latest'
  const page     = parseInt(searchParams.get('page') || '0', 10)

  const updateParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setPage = useCallback((p) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (p === 0) next.delete('page'); else next.set('page', p)
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    setLoading(true)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    getWallpapers({ category, search, sort, page, size: PAGE_SIZE })
      .then(data => {
        setWallpapers(data.content || [])
        setTotalItems(data.totalItems || 0)
        setTotalPages(data.totalPages || 0)
      })
      .catch(() => setError('Failed to load wallpapers. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [category, search, sort, page])

  const skeletons = Array.from({ length: PAGE_SIZE })

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {search
            ? <>Results for <em>"{search}"</em></>
            : category
              ? <>{category} <span>Wallpapers</span></>
              : <>Stunning <span>HD Wallpapers</span> — Free</>
          }
        </h1>
        <p className={styles.heroSub}>Curated collection for desktop & mobile. Download in full resolution.</p>
      </div>

      {/* Ad placeholder top */}
      <div className={styles.adBanner}>
        📢 Ad Placeholder (728×90 Leaderboard) — Replace with AdSense
      </div>

      <div className={styles.container}>
        {/* Filters */}
        <CategoryFilter
          selected={category || 'All'}
          onChange={cat => updateParam('category', cat)}
        />

        <SortBar
          sort={sort}
          onChange={s => updateParam('sort', s)}
          total={totalItems}
        />

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <Frown size={32} />
            <p>{error}</p>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <div className={styles.grid}>
            {loading
              ? skeletons.map((_, i) => (
                  <div key={i} className={`${styles.skeletonCard} skeleton`} />
                ))
              : wallpapers.length > 0
                ? wallpapers.map((w, i) => (
                    <WallpaperCard key={w.id} wallpaper={w} index={i} />
                  ))
                : (
                  <div className={styles.empty}>
                    <Frown size={48} color="var(--text3)" />
                    <h3>No wallpapers found</h3>
                    <p>Try a different category or search term.</p>
                  </div>
                )
            }
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p
                if (totalPages <= 7) {
                  p = i
                } else if (page < 4) {
                  p = i
                } else if (page > totalPages - 4) {
                  p = totalPages - 7 + i
                } else {
                  p = page - 3 + i
                }
                return (
                  <button
                    key={p}
                    className={`${styles.pageNum} ${p === page ? styles.pageNumActive : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p + 1}
                  </button>
                )
              })}
            </div>

            <button
              className={styles.pageBtn}
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Ad placeholder bottom */}
        <div className={styles.adBannerBottom}>
          📢 Ad Placeholder (336×280 Rectangle) — Replace with AdSense
        </div>
      </div>
    </div>
  )
}
