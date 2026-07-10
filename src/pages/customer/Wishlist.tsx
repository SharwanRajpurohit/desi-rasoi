import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types'
import { getProductById } from '../../services/products'
import { useWishlist } from '../../context/WishlistContext'
import { ProductGrid } from '../../components/customer/ProductGrid'
import { EmptyState } from '../../components/ui/EmptyState'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); setLoading(false); return }
    Promise.all(wishlist.map((id) => getProductById(id))).then((results) => {
      setProducts(results.filter((p): p is Product => p !== null && p.active))
      setLoading(false)
    })
  }, [wishlist])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-400 fill-current" />
        <h1 className="font-display text-3xl text-charcoal">Wishlist</h1>
        {wishlist.length > 0 && (
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-sm text-warm-gray">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!loading && products.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="Your wishlist is empty"
          description="Save products you love by tapping the heart icon on any product."
          action={{ label: 'Browse Products', onClick: () => navigate('/products') }}
        />
      ) : (
        <ProductGrid products={products} loading={loading} />
      )}
    </div>
  )
}
