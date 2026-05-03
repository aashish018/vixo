import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search, Sparkles, X } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const submitSearch = event => {
    event.preventDefault()
    const nextQuery = query.trim()
    navigate(nextQuery ? `/?search=${encodeURIComponent(nextQuery)}` : '/')
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoBadge}><Sparkles size={16} /></span>
          <span className={styles.logoText}>WallpaperVault</span>
        </Link>

        <form className={styles.search} onSubmit={submitSearch}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search landscapes, neon, minimal..."
            aria-label="Search wallpapers"
          />
        </form>

        <nav className={styles.links}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Explore</Link>
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
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Submit</Link>
        </div>
      )}
    </header>
  )
}
