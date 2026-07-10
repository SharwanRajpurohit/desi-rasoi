import seedData from '../data/seed.json'
import type { Category, Product } from '../types'
import { getItem, setItem, clearAll } from './storage'
import { _setCategoriesSync } from './categories'
import { _setProductsSync } from './products'

const INIT_KEY = 'initialized'

/**
 * Load seed data on first visit.
 * Checks `desi_rasoi_initialized` flag — does nothing if already seeded.
 */
export function initializeIfNeeded(): void {
  if (getItem<boolean>(INIT_KEY)) return

  _setCategoriesSync(seedData.categories as Category[])
  _setProductsSync(seedData.products as Product[])
  setItem('orders', [])
  setItem('cart', [])
  setItem(INIT_KEY, true)

  console.info('[Desi Rasoi] Seed data loaded — 8 categories, 24 products.')
}

/**
 * Wipe all app data and re-seed. Available in admin panel.
 */
export function resetAllData(): void {
  clearAll()
  _setCategoriesSync(seedData.categories as Category[])
  _setProductsSync(seedData.products as Product[])
  setItem('orders', [])
  setItem('cart', [])
  setItem(INIT_KEY, true)
  console.info('[Desi Rasoi] Data reset to seed state.')
}

/**
 * Export all app data as a JSON string (for admin download utility).
 */
export function exportData(): string {
  const data = {
    categories: getItem('categories'),
    products: getItem('products'),
    orders: getItem('orders'),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

/**
 * Import previously exported data.
 */
export function importData(json: string): void {
  try {
    const data = JSON.parse(json)
    if (data.categories) setItem('categories', data.categories)
    if (data.products) setItem('products', data.products)
    if (data.orders) setItem('orders', data.orders)
    console.info('[Desi Rasoi] Data imported successfully.')
  } catch {
    throw new Error('Invalid import file. Please use a valid Desi Rasoi export.')
  }
}
