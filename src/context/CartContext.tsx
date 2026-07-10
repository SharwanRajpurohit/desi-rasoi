import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem } from '../types'
import {
  getCart,
  getCartItemCount,
  addToCart as svcAdd,
  updateQuantity as svcUpdate,
  removeFromCart as svcRemove,
  clearCart as svcClear,
} from '../services/cart'

interface CartContextValue {
  cart: CartItem[]
  itemCount: number
  addToCart: (productId: string, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => getCart())
  const [itemCount, setItemCount] = useState(() => getCartItemCount())

  const sync = useCallback(() => {
    const current = getCart()
    setCart(current)
    setItemCount(current.reduce((s, i) => s + i.quantity, 0))
  }, [])

  // Sync on mount in case localStorage was changed by another tab
  useEffect(() => {
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [sync])

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      svcAdd(productId, quantity)
      sync()
    },
    [sync],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      svcUpdate(productId, quantity)
      sync()
    },
    [sync],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      svcRemove(productId)
      sync()
    },
    [sync],
  )

  const clearCart = useCallback(() => {
    svcClear()
    sync()
  }, [sync])

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
