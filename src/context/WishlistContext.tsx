import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getWishlist,
  isWishlisted,
  toggleWishlist as toggleInStorage,
  clearWishlist as clearInStorage,
} from '../services/wishlist'

interface WishlistContextValue {
  wishlist: string[]
  count: number
  isWishlisted: (productId: string) => boolean
  toggle: (productId: string) => boolean
  clear: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist())

  // Keep in sync with storage events (other tabs, debug resets)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes('wishlist')) setWishlist(getWishlist())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = (productId: string): boolean => {
    const now = toggleInStorage(productId)
    setWishlist(getWishlist())
    return now
  }

  const clear = () => {
    clearInStorage()
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        count: wishlist.length,
        isWishlisted: (id) => isWishlisted(id),
        toggle,
        clear,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
