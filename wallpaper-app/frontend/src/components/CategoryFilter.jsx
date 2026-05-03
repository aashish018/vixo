import { useEffect, useState } from 'react'
import { getCategories } from '../utils/api.js'
import styles from './CategoryFilter.module.css'

const DEFAULT_CATEGORIES = ['All', 'Nature', 'Urban', 'AI Art', 'AMOLED', 'Minimal', 'Bikes', 'Space']

export default function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  useEffect(() => {
    getCategories()
      .then(cats => setCategories(['All', ...cats]))
      .catch(() => setCategories(DEFAULT_CATEGORIES))
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.chip} ${selected === cat || (cat === 'All' && !selected) ? styles.active : ''}`}
            onClick={() => onChange(cat === 'All' ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
