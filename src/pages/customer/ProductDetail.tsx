import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronRight, Minus, Plus, Check, Heart } from 'lucide-react'
import clsx from 'clsx'
import type { Product, Category } from '../../types'
import { getProductBySlug, getProducts } from '../../services/products'
import { getCategoryById } from '../../services/categories'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useWishlist } from '../../context/WishlistContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { ReviewSection } from '../../components/customer/ReviewSection'
import { ProductGrid } from '../../components/customer/ProductGrid'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { success, error } = useToast()
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()

  const [product, setProduct]     = useState<Product | null>(null)
  const [category, setCategory]   = useState<Category | null>(null)
  const [related, setRelated]     = useState<Product[]>([])
  const [qty, setQty]             = useState(1)
  const [loading, setLoading]     = useState(true)
  const [imgError, setImgError]   = useState(false)
  const [added, setAdded]         = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setRelated([])
    getProductBySlug(slug).then(async (p) => {
      if (!p) { navigate('/products', { replace: true }); return }
      setProduct(p)
      const [cat, rel] = await Promise.all([
        getCategoryById(p.categoryId),
        getProducts({ categoryId: p.categoryId }),
      ])
      setCategory(cat)
      setRelated(rel.filter((r) => r.id !== p.id).slice(0, 4))
      setLoading(false)
    })
  }, [slug, navigate])

  const handleWishlist = () => {
    if (!product) return
    const now = toggleWishlist(product.id)
    success(now ? `${product.nameEn} saved to wishlist` : 'Removed from wishlist')
  }

  const handleAdd = () => {
    if (!product || product.stock === 0) return
    if (qty > product.stock) { error(`Only ${product.stock} units available`); return }
    addToCart(product.id, qty)
    success(`${qty}× ${product.nameEn} added to cart`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Skeleton className="mb-6 h-4 w-48" />
        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const inStock   = product.stock > 0
  const lowStock  = product.stock > 0 && product.stock <= 10

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-warm-gray">
        <Link to="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-brand">Products</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/categories/${category.slug}`} className="hover:text-brand">
              {category.nameEn}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal">{product.nameEn}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl bg-sand aspect-square">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.nameEn}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl">🍽️</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {category && (
            <Link
              to={`/categories/${category.slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-brand hover:text-brand-dark"
            >
              {category.icon} {category.nameEn}
            </Link>
          )}

          <div>
            <h1 className="font-display text-3xl text-charcoal">{product.nameEn}</h1>
            <p className="font-hindi mt-1 text-base text-warm-gray">{product.nameHi}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {inStock ? (
              lowStock
                ? <Badge variant="warning">Only {product.stock} left</Badge>
                : <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
            {product.featured && <Badge>Featured</Badge>}
          </div>

          <p className="text-sm leading-relaxed text-warm-gray">{product.description}</p>

          {/* Qty + Add */}
          {inStock && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-charcoal">Quantity</span>
                <div className="flex items-center rounded-lg border border-sand-dark">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-warm-gray hover:text-charcoal transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center text-warm-gray hover:text-charcoal transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-warm-gray">{product.stock} available</span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAdd}
                  size="lg"
                  fullWidth
                  variant={added ? 'secondary' : 'primary'}
                  icon={added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                >
                  {added ? 'Added to Cart!' : `Add to Cart — ₹${(product.price * qty).toLocaleString('en-IN')}`}
                </Button>
                <button
                  onClick={handleWishlist}
                  className={clsx(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors',
                    isWishlisted(product.id)
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-sand-dark text-warm-gray hover:border-red-300 hover:text-red-400',
                  )}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={clsx('h-5 w-5', isWishlisted(product.id) && 'fill-current')} />
                </button>
              </div>
            </>
          )}

          <div className="rounded-xl bg-sand p-4 text-sm text-warm-gray space-y-1">
            <p>🚚 Delivery across India — ₹49 flat fee</p>
            <p>💰 Cash on Delivery available</p>
            <p>📦 Carefully packaged for freshness</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-2xl text-charcoal">
            More from {category?.nameEn ?? 'this category'}
          </h2>
          <ProductGrid products={related} loading={false} />
        </div>
      )}

      {/* Mobile sticky bar */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-sand-dark bg-white p-3 shadow-lg md:hidden">
          <Button onClick={handleAdd} fullWidth size="lg" variant={added ? 'secondary' : 'primary'} icon={<ShoppingCart className="h-5 w-5" />}>
            {added ? 'Added!' : `Add to Cart — ₹${(product.price * qty).toLocaleString('en-IN')}`}
          </Button>
        </div>
      )}
    </div>
  )
}
