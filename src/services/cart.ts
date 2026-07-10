import type { CartItem, CartItemEnriched, CartSummary } from '../types'
import { getItem, setItem } from './storage'
import { getProductById } from './products'

const KEY = 'cart'
const DELIVERY_FEE = 49

// ─── Sync accessors ───────────────────────────────────────────────────────────

export function getCart(): CartItem[] {
  return getItem<CartItem[]>(KEY) ?? []
}

export function getCartItemCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

function saveCart(items: CartItem[]): void {
  setItem(KEY, items)
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function addToCart(productId: string, quantity = 1): CartItem[] {
  const cart = getCart()
  const existing = cart.find((i) => i.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  saveCart(cart)
  return cart
}

export function updateQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  if (quantity <= 0) {
    return removeFromCart(productId)
  }
  const existing = cart.find((i) => i.productId === productId)
  if (existing) {
    existing.quantity = quantity
    saveCart(cart)
  }
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((i) => i.productId !== productId)
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  saveCart([])
}

// ─── Enriched summary (async, needs product lookup) ──────────────────────────

export async function getCartSummary(): Promise<CartSummary> {
  const cart = getCart()

  const enriched: CartItemEnriched[] = []
  for (const item of cart) {
    const product = await getProductById(item.productId)
    if (product && product.active) {
      enriched.push({
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      })
    }
  }

  const subtotal = enriched.reduce((sum, i) => sum + i.lineTotal, 0)
  const itemCount = enriched.reduce((sum, i) => sum + i.quantity, 0)

  return {
    items: enriched,
    subtotal,
    deliveryFee: subtotal > 0 ? DELIVERY_FEE : 0,
    total: subtotal > 0 ? subtotal + DELIVERY_FEE : 0,
    itemCount,
  }
}
