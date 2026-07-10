import type { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  emptyTitle?: string
  emptyDescription?: string
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or filters.',
}: ProductGridProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" />}
        title={emptyTitle}
        description={emptyDescription}
        action={{ label: 'Browse all products', onClick: () => navigate('/products') }}
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
