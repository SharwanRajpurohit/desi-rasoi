import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import type { CartSummary } from '../../types'
import { getCartSummary } from '../../services/cart'
import { useCart } from '../../context/CartContext'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [summary, setSummary] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCartSummary().then((s) => { setSummary(s); setLoading(false) })
  }, [cart])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Skeleton className="mb-8 h-8 w-40" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!summary || summary.items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 font-display text-3xl text-charcoal">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={{ label: 'Start Shopping', onClick: () => navigate('/products') }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-display text-3xl text-charcoal">
        Your Cart
        <span className="ml-3 text-base font-normal text-warm-gray">
          ({summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''})
        </span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {summary.items.map(({ product, quantity, lineTotal }) => (
            <div key={product.id} className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
              {/* Image */}
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-sand">
                  <img
                    src={product.imageUrl}
                    alt={product.nameEn}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <Link
                    to={`/products/${product.slug}`}
                    className="font-semibold text-charcoal hover:text-brand transition-colors line-clamp-1"
                  >
                    {product.nameEn}
                  </Link>
                  <p className="font-hindi text-xs text-warm-gray">{product.nameHi}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {/* Stepper */}
                  <div className="flex items-center rounded-lg border border-sand-dark">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-warm-gray hover:text-charcoal"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                      className="flex h-8 w-8 items-center justify-center text-warm-gray hover:text-charcoal"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-bold text-charcoal">₹{lineTotal.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-warm-gray hover:text-royal transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg text-charcoal">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-warm-gray">
              <span>Subtotal ({summary.itemCount} items)</span>
              <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-warm-gray">
              <span>Delivery fee</span>
              <span>₹{summary.deliveryFee}</span>
            </div>
            <div className="border-t border-sand-dark pt-2 flex justify-between font-bold text-charcoal text-base">
              <span>Total</span>
              <span>₹{summary.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <Button fullWidth size="lg" className="mt-6" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
          <Link
            to="/products"
            className="mt-3 block text-center text-sm text-brand hover:text-brand-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
