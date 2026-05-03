import { ArrowDownWideNarrow, Clock3, Flame, Sparkles } from 'lucide-react'
import styles from './SortBar.module.css'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest', icon: Clock3 },
  { value: 'trending', label: 'Trending', icon: Flame },
  { value: 'popular', label: 'Popular', icon: Sparkles },
  { value: 'oldest', label: 'Archive', icon: ArrowDownWideNarrow },
]

export default function SortBar({ sort, onChange, total }) {
  return (
    <section className={styles.bar}>
      <div>
        <div className={styles.caption}>Curated Feed</div>
        <div className={styles.total}>{total.toLocaleString()} wallpapers</div>
      </div>
      <div className={styles.options}>
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={`${styles.option} ${sort === value ? styles.active : ''}`}
            onClick={() => onChange(value)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
