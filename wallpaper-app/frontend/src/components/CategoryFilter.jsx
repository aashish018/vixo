import { useEffect, useState } from 'react'
import { getCategories } from '../utils/api.js'
import styles from './CategoryFilter.module.css'

const DEFAULT_CATEGORIES = ['All', 'Nature', 'Urban', 'Minimal', 'Space', 'Abstract']

export default function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  useEffect(() => {
    getCategories()
      .then(items => setCategories(['All', ...items]))
      .catch(() => setCategories(DEFAULT_CATEGORIES))
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.label}>Categories</div>
      <div className={styles.row}>
        {categories.map(category => {
          const active = selected === category || (!selected && category === 'All')
          return (
            <button
              key={category}
              type="button"
              className={`${styles.chip} ${active ? styles.active : ''}`}
              onClick={() => onChange(category === 'All' ? '' : category)}
            >
              {category}
            </button>
          )
        })}
      </div>
    </section>
  )
}
