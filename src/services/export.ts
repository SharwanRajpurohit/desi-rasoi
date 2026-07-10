import type { Order, Product } from '../types'

function escapeCSV(val: unknown): string {
  const s = String(val ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function toCSV(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(escapeCSV).join(','),
    ...rows.map((r) => r.map(escapeCSV).join(',')),
  ]
  return lines.join('\r\n')
}

function download(content: string, filename: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportOrdersCSV(orders: Order[]): void {
  const headers = [
    'Order Number', 'Customer Name', 'Customer Email', 'Status',
    'Items', 'Subtotal (₹)', 'Delivery (₹)', 'Total (₹)',
    'Payment Method', 'City', 'State', 'Pincode', 'Placed At',
  ]
  const rows = orders.map((o) => [
    o.orderNumber,
    o.customerName,
    o.customerEmail,
    o.status,
    o.items.map((i) => `${i.productName} ×${i.quantity}`).join(' | '),
    o.subtotal,
    o.deliveryFee,
    o.total,
    'Cash on Delivery',
    o.shippingAddress.city,
    o.shippingAddress.state,
    o.shippingAddress.pincode,
    new Date(o.createdAt).toLocaleString('en-IN'),
  ])
  download(toCSV(headers, rows), `desi-rasoi-orders-${Date.now()}.csv`)
}

export function exportProductsCSV(products: Product[]): void {
  const headers = [
    'ID', 'Name (EN)', 'Name (HI)', 'Slug', 'Category ID',
    'Price (₹)', 'Stock', 'Featured', 'Active', 'Created At',
  ]
  const rows = products.map((p) => [
    p.id, p.nameEn, p.nameHi, p.slug, p.categoryId,
    p.price, p.stock,
    p.featured ? 'Yes' : 'No',
    p.active ? 'Yes' : 'No',
    new Date(p.createdAt).toLocaleString('en-IN'),
  ])
  download(toCSV(headers, rows), `desi-rasoi-products-${Date.now()}.csv`)
}
