import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (rating: number) => void
}

const SIZE = { sm: 'h-3.5 w-3.5', md: 'h-4.5 w-4.5', lg: 'h-5 w-5' }

export function StarRating({ value, max = 5, interactive = false, size = 'md', onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const active = interactive ? (hovered || value) : value

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= active
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            className={clsx(
              'transition-transform',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              !interactive && 'pointer-events-none',
            )}
          >
            <Star
              className={clsx(
                SIZE[size] ?? SIZE.md,
                filled ? 'fill-marigold text-marigold' : 'fill-transparent text-sand-dark',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
