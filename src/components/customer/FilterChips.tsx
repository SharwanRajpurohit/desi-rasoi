import clsx from 'clsx'
import type { Category } from '../../types'

interface FilterChipsProps {
  categories: Category[]
  selected: string        // category slug or '' for all
  onChange: (slug: string) => void
}

export function FilterChips({ categories, selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={clsx(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          selected === ''
            ? 'bg-brand text-white'
            : 'bg-white text-warm-gray hover:bg-sand hover:text-charcoal',
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={clsx(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selected === cat.slug
              ? 'bg-brand text-white'
              : 'bg-white text-warm-gray hover:bg-sand hover:text-charcoal',
          )}
        >
          {cat.icon} {cat.nameEn}
        </button>
      ))}
    </div>
  )
}
