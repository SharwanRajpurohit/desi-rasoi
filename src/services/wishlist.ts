import { getItem, setItem } from './storage'

const KEY = 'wishlist'

function load(): string[] {
  return getItem<string[]>(KEY) ?? []
}

function save(ids: string[]): void {
  setItem(KEY, ids)
}

export function getWishlist(): string[] {
  return load()
}

export function isWishlisted(productId: string): boolean {
  return load().includes(productId)
}

export function toggleWishlist(productId: string): boolean {
  const list = load()
  const idx  = list.indexOf(productId)
  if (idx === -1) {
    save([...list, productId])
    return true    // now wishlisted
  } else {
    save(list.filter((id) => id !== productId))
    return false   // now removed
  }
}

export function clearWishlist(): void {
  save([])
}
