import { Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
      padding: '32px 24px',
      marginTop: '60px'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-head)', fontSize: '1rem' }}>
          <Layers size={18} color="var(--accent)" />
          <span>Wallpaper<strong style={{ color: 'var(--accent2)' }}>Vault</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 20, color: 'var(--text3)', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--text3)' }}>Browse</Link>
          <Link to="/admin" style={{ color: 'var(--text3)' }}>Admin</Link>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} WallpaperVault · Free HD Wallpapers
        </p>
      </div>

      {/* AdSense placeholder */}
      <div style={{
        maxWidth: 1400, margin: '24px auto 0',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        textAlign: 'center',
        color: 'var(--text3)',
        fontSize: '0.78rem',
      }}>
        📢 Advertisement Placeholder — Replace with Google AdSense code
        {/* <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" /> */}
      </div>
    </footer>
  )
}
