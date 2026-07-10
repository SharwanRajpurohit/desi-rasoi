import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Heart } from 'lucide-react'
import clsx from 'clsx'
import type { Product } from '../../types'
import { Badge } from '../ui/Badge'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useWishlist } from '../../context/WishlistContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { success } = useToast()
  const { isWishlisted, toggle } = useWishlist()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    const now = toggle(product.id)
    success(now ? `${product.nameEn} saved to wishlist` : `Removed from wishlist`)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    addToCart(product.id)
    success(`${product.nameEn} added to cart`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl bg-sand aspect-[4/3]">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🍽️</div>
        )}
        {product.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-marigold px-2 py-0.5 text-[10px] font-bold text-charcoal">
            Featured
          </span>
        )}
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={clsx(
            'absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full shadow transition-colors',
            isWishlisted(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-warm-gray hover:text-red-400',
          )}
          aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={clsx('h-3.5 w-3.5', isWishlisted(product.id) && 'fill-current')} />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="error">Out of Stock</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-sm font-semibold text-charcoal line-clamp-2 leading-snug">
          {product.nameEn}
        </p>
        <p className="font-hindi mt-0.5 text-xs text-warm-gray">{product.nameHi}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-charcoal">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.stock > 0 && product.stock <= 10 && (
            <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
          )}
          {product.stock > 10 && (
            <Badge variant="success" size="sm">In Stock</Badge>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={clsx(
            'mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all',
            added
              ? 'bg-green-500 text-white'
              : product.stock === 0
                ? 'cursor-not-allowed bg-sand text-warm-gray'
                : 'bg-brand text-white hover:bg-brand-dark active:scale-95',
          )}
          aria-label={`Add ${product.nameEn} to cart`}
        >
          {added ? (
            <><Check className="h-4 w-4" /> Added!</>
          ) : (
            <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
          )}
        </button>
      </div>
    </Link>
  )
}
