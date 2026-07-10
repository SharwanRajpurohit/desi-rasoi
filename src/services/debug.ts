/**
 * Dev-only debug namespace exposed on window.__DESI_RASOI__
 * Available in browser console during development.
 */
import { getItem } from './storage'
import { resetAllData, exportData, importData } from './seed'

if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__DESI_RASOI__ = {
    getProducts: () => getItem('products'),
    getOrders: () => getItem('orders'),
    getCategories: () => getItem('categories'),
    getCart: () => getItem('cart'),
    getCustomer: () => getItem('customer'),
    resetData: resetAllData,
    exportData,
    importData,
    help: () =>
      console.log(
        [
          '__DESI_RASOI__ commands:',
          '  .getProducts()   — list all products',
          '  .getOrders()     — list all orders',
          '  .getCategories() — list all categories',
          '  .getCart()       — current cart',
          '  .getCustomer()   — current customer session',
          '  .resetData()     — wipe and re-seed',
          '  .exportData()    — get JSON export string',
          '  .importData(str) — import from JSON string',
        ].join('\n'),
      ),
  }
  console.info('[Desi Rasoi] Debug namespace available. Type __DESI_RASOI__.help() to see commands.')
}
