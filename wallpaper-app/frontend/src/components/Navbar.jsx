import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, Layers } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
      setMenuOpen(false)
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <Layers size={22} strokeWidth={2} />
          <span>Wallpaper<strong>Vault</strong></span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search wallpapers..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>

        {/* Desktop links */}
        <div className={styles.links}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Browse</Link>
          <Link to="/admin" className={location.pathname === '/admin' ? styles.active : ''}>Admin</Link>
        </div>

        {/* Mobile hamburger */}
        <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <form onSubmit={handleSearch} className={styles.mobileSearch}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Search wallpapers..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
        </div>
      )}
    </nav>
  )
}
