import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search, Shuffle, Sparkles, X } from 'lucide-react'
import styles from './Navbar.module.css'
import useDebouncedValue from '../hooks/useDebouncedValue.js'
import { getMoodCollections, getRecentSearches, saveRecentSearch } from '../utils/wallpaperMeta.js'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const debouncedQuery = useDebouncedValue(query, 250)
  const moodCollections = useMemo(() => Object.entries(getMoodCollections()).slice(0, 5), [])

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
    setRecentSearches(getRecentSearches())
  }, [searchParams])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen || location.pathname !== '/') return
    if (!debouncedQuery.trim()) return
    navigate(`/?search=${encodeURIComponent(debouncedQuery.trim())}`, { replace: true })
  }, [debouncedQuery, searchOpen, location.pathname, navigate])

  const submitSearch = event => {
    event.preventDefault()
    const nextQuery = query.trim()
    if (nextQuery) {
      saveRecentSearch(nextQuery)
      setRecentSearches(getRecentSearches())
    }
    navigate(nextQuery ? `/?search=${encodeURIComponent(nextQuery)}` : '/')
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const surprise = () => navigate('/?sort=trending')

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.shell}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoBadge}><Sparkles size={16} /></span>
          <span className={styles.logoText}>WallpaperVault</span>
        </Link>

        <form className={`${styles.search} ${searchOpen ? styles.searchOpen : ''}`} onSubmit={submitSearch}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search landscapes, neon, minimal..."
            aria-label="Search wallpapers"
          />
          {searchOpen && recentSearches.length > 0 && (
            <div className={styles.searchPanel}>
              <div className={styles.panelLabel}>Recent searches</div>
              <div className={styles.panelRow}>
                {recentSearches.map(item => (
                  <button
                    key={item}
                    type="button"
                    className={styles.panelChip}
                    onClick={() => {
                      setQuery(item)
                      navigate(`/?search=${encodeURIComponent(item)}`)
                      setSearchOpen(false)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className={styles.panelLabel}>Mood shortcuts</div>
              <div className={styles.panelRow}>
                {moodCollections.map(([slug, entry]) => (
                  <Link key={slug} to={`/collections/${slug}`} className={styles.panelChip} onClick={() => setSearchOpen(false)}>
                    {entry.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </form>

        <nav className={styles.links}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Explore</Link>
          <button type="button" className={styles.surpriseButton} onClick={surprise}>
            <Shuffle size={14} />
            Surprise
          </button>
          <Link to="/admin" className={location.pathname === '/admin' ? styles.active : ''}>Submit</Link>
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen(open => !open)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <form className={styles.mobileSearch} onSubmit={submitSearch}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search the collection"
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)}>Explore</Link>
          <button type="button" className={styles.mobileLinkButton} onClick={() => { surprise(); setMenuOpen(false) }}>
            Surprise Me
          </button>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Submit</Link>
        </div>
      )}
    </header>
  )
}
