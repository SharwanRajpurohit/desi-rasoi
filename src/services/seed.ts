import seedData from '../data/seed.json'
import type { Category, Product, Review } from '../types'
import { getItem, setItem, clearAll } from './storage'
import { _setCategoriesSync } from './categories'
import { _setProductsSync } from './products'
import { _seedReviews } from './reviews'

const INIT_KEY = 'initialized'

const SEED_REVIEWS: Review[] = [
  { id: 'rev_001', productId: 'prod_ghevar',         customerId: 'demo_1', customerName: 'Priya Sharma',    rating: 5, comment: 'Absolutely authentic taste! The crispy texture and sweet syrup bring back childhood memories. Fast delivery too.',             createdAt: '2026-06-01T10:00:00Z' },
  { id: 'rev_002', productId: 'prod_ghevar',         customerId: 'demo_2', customerName: 'Rohan Mehta',     rating: 4, comment: 'Very good ghevar, tastes just like what we get in Jaipur. Could have a bit more rabri but overall excellent.',              createdAt: '2026-06-05T14:30:00Z' },
  { id: 'rev_003', productId: 'prod_mawa_kachori',   customerId: 'demo_3', customerName: 'Sunita Verma',    rating: 5, comment: 'Best mawa kachori I\'ve had outside Rajasthan! The filling is rich and perfectly sweet. Will order again.',                  createdAt: '2026-06-10T09:15:00Z' },
  { id: 'rev_004', productId: 'prod_dal_baati',      customerId: 'demo_4', customerName: 'Amit Joshi',      rating: 5, comment: 'Authentic rajasthani flavour. The baatis are perfectly baked and the dal is aromatic. Loved every bite.',                    createdAt: '2026-06-12T18:00:00Z' },
  { id: 'rev_005', productId: 'prod_dal_baati',      customerId: 'demo_5', customerName: 'Neha Singh',      rating: 4, comment: 'Good quality product. The churma is a nice bonus. Would have given 5 stars if the packaging was slightly better.',           createdAt: '2026-06-15T11:00:00Z' },
  { id: 'rev_006', productId: 'prod_ker_sangri',     customerId: 'demo_6', customerName: 'Vikram Rathore',  rating: 5, comment: 'Rare desert vegetables, perfectly spiced. Takes me back to my grandmother\'s kitchen. Truly authentic!',                      createdAt: '2026-06-20T16:45:00Z' },
  { id: 'rev_007', productId: 'prod_mathri',         customerId: 'demo_7', customerName: 'Kavita Patel',    rating: 5, comment: 'Crispy, flaky and perfectly salted. Great with chai. My entire family finished a box in one evening!',                       createdAt: '2026-06-22T08:30:00Z' },
  { id: 'rev_008', productId: 'prod_rajasthani_chai',customerId: 'demo_8', customerName: 'Deepak Gupta',    rating: 4, comment: 'Strong aromatic blend, tastes excellent. The cardamom and ginger are well balanced. Perfect morning cup.',                   createdAt: '2026-06-25T07:00:00Z' },
]

/**
 * Load seed data on first visit.
 * Checks `desi_rasoi_initialized` flag — does nothing if already seeded.
 */
export function initializeIfNeeded(): void {
  if (getItem<boolean>(INIT_KEY)) return

  _setCategoriesSync(seedData.categories as Category[])
  _setProductsSync(seedData.products as Product[])
  _seedReviews(SEED_REVIEWS)
  setItem('orders', [])
  setItem('cart', [])
  setItem(INIT_KEY, true)

  console.info('[Desi Rasoi] Seed data loaded — 8 categories, 24 products, 8 reviews.')
}

/**
 * Wipe all app data and re-seed. Available in admin panel.
 */
export function resetAllData(): void {
  clearAll()
  _setCategoriesSync(seedData.categories as Category[])
  _setProductsSync(seedData.products as Product[])
  _seedReviews(SEED_REVIEWS)
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
