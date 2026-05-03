import styles from './SortBar.module.css'
import { TrendingUp, Clock, Download, Zap } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'latest',   label: 'Latest',   icon: Clock },
  { value: 'trending', label: 'Trending',  icon: TrendingUp },
  { value: 'popular',  label: 'Popular',   icon: Download },
  { value: 'oldest',   label: 'Oldest',   icon: Zap },
]

export default function SortBar({ sort, onChange, total }) {
  return (
    <div className={styles.bar}>
      <span className={styles.count}>{total?.toLocaleString() ?? '—'} wallpapers</span>
      <div className={styles.options}>
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            className={`${styles.btn} ${sort === value ? styles.active : ''}`}
            onClick={() => onChange(value)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
