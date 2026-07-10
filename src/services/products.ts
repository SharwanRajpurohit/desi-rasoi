import type { Product, ProductFilters, StockLogEntry } from '../types'
import { getItem, setItem } from './storage'
import { nanoid, now, simulateDelay } from './utils'

const KEY = 'products'
const STOCK_LOG_KEY = 'stock_log'
const LOW_STOCK_THRESHOLD = 10

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.activeOnly !== false) {
    result = result.filter((p) => p.active)
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId)
  }
  if (filters.featuredOnly) {
    result = result.filter((p) => p.featured)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(q) ||
        p.nameHi.includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  switch (filters.sort) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name_asc':
      result.sort((a, b) => a.nameEn.localeCompare(b.nameEn))
      break
    case 'newest':
    default:
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }

  return result
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  return applyFilters(products, { activeOnly: true, ...filters })
}

export async function getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  return applyFilters(products, { activeOnly: false, ...filters })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await simulateDelay()
  return (getItem<Product[]>(KEY) ?? []).find((p) => p.slug === slug) ?? null
}

export async function getProductById(id: string): Promise<Product | null> {
  await simulateDelay()
  return (getItem<Product[]>(KEY) ?? []).find((p) => p.id === id) ?? null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featuredOnly: true })
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  return getProducts({ categoryId })
}

export async function getLowStockProducts(threshold = LOW_STOCK_THRESHOLD): Promise<Product[]> {
  await simulateDelay()
  return (getItem<Product[]>(KEY) ?? [])
    .filter((p) => p.active && p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock)
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Product> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  const slug = data.slug || data.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  if (products.some((p) => p.slug === slug)) {
    throw new Error(`Product slug "${slug}" already exists`)
  }
  const ts = now()
  const product: Product = { ...data, id: nanoid('prod'), slug, createdAt: ts, updatedAt: ts }
  products.unshift(product)
  setItem(KEY, products)
  return product
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>,
): Promise<Product> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error(`Product ${id} not found`)
  const updated: Product = { ...products[idx], ...data, updatedAt: now() }
  products[idx] = updated
  setItem(KEY, products)
  return updated
}

export async function deleteProduct(id: string): Promise<void> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error(`Product ${id} not found`)
  // Soft-delete: mark inactive
  products[idx] = { ...products[idx], active: false, updatedAt: now() }
  setItem(KEY, products)
}

export async function adjustStock(
  productId: string,
  delta: number,
  reason: string,
): Promise<Product> {
  await simulateDelay()
  const products = getItem<Product[]>(KEY) ?? []
  const idx = products.findIndex((p) => p.id === productId)
  if (idx === -1) throw new Error(`Product ${productId} not found`)

  const previousStock = products[idx].stock
  const newStock = Math.max(0, previousStock + delta)
  products[idx] = { ...products[idx], stock: newStock, updatedAt: now() }
  setItem(KEY, products)

  // Append to stock log
  const log = getItem<StockLogEntry[]>(STOCK_LOG_KEY) ?? []
  log.push({ productId, previousStock, newStock, reason, timestamp: now() })
  setItem(STOCK_LOG_KEY, log)

  return products[idx]
}

// Sync helpers for seed + order service
export function _setProductsSync(products: Product[]): void {
  setItem(KEY, products)
}

export function _adjustStockSync(productId: string, delta: number, reason: string): void {
  const products = getItem<Product[]>(KEY) ?? []
  const idx = products.findIndex((p) => p.id === productId)
  if (idx === -1) return
  const previousStock = products[idx].stock
  const newStock = Math.max(0, previousStock + delta)
  products[idx] = { ...products[idx], stock: newStock, updatedAt: now() }
  setItem(KEY, products)

  const log = getItem<StockLogEntry[]>(STOCK_LOG_KEY) ?? []
  log.push({ productId, previousStock, newStock, reason, timestamp: now() })
  setItem(STOCK_LOG_KEY, log)
}
