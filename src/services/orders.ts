import type {
  Order,
  OrderItem,
  CartItem,
  Customer,
  ShippingAddress,
  OrderStatus,
  StatusHistoryEntry,
  OrderStats,
} from '../types'
import { getItem, setItem } from './storage'
import { nanoid, now, generateOrderNumber, simulateDelay, isToday } from './utils'
import { _adjustStockSync, getProductById } from './products'

const KEY = 'orders'
const DELIVERY_FEE = 49

// ─── Allowed status transitions ──────────────────────────────────────────────

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to)
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getOrders(filters?: {
  status?: OrderStatus
  customerId?: string
  search?: string
}): Promise<Order[]> {
  await simulateDelay()
  let orders = getItem<Order[]>(KEY) ?? []

  if (filters?.status) {
    orders = orders.filter((o) => o.status === filters.status)
  }
  if (filters?.customerId) {
    orders = orders.filter((o) => o.customerId === filters.customerId)
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q),
    )
  }

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function getOrderById(id: string): Promise<Order | null> {
  await simulateDelay()
  return (getItem<Order[]>(KEY) ?? []).find((o) => o.id === id) ?? null
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return getOrders({ customerId })
}

// ─── Create Order ─────────────────────────────────────────────────────────────

export async function createOrder(
  cartItems: CartItem[],
  address: ShippingAddress,
  customer: Customer,
): Promise<Order> {
  await simulateDelay(100)

  if (cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Validate stock for all items
  const orderItems: OrderItem[] = []
  for (const item of cartItems) {
    const product = await getProductById(item.productId)
    if (!product) throw new Error(`Product not found: ${item.productId}`)
    if (!product.active) throw new Error(`${product.nameEn} is no longer available`)
    if (product.stock < item.quantity) {
      throw new Error(
        `Only ${product.stock} unit(s) of "${product.nameEn}" in stock`,
      )
    }
    orderItems.push({
      productId: product.id,
      productName: product.nameEn,
      productImage: product.imageUrl,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
    })
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.lineTotal, 0)
  const ts = now()
  const orders = getItem<Order[]>(KEY) ?? []

  const order: Order = {
    id: nanoid('ord'),
    orderNumber: generateOrderNumber(orders.length),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    status: 'placed',
    items: orderItems,
    shippingAddress: address,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    paymentMethod: 'cod',
    statusHistory: [{ status: 'placed', timestamp: ts }],
    createdAt: ts,
    updatedAt: ts,
  }

  // Deduct stock synchronously so next read sees updated values
  for (const item of cartItems) {
    _adjustStockSync(item.productId, -item.quantity, `Order ${order.orderNumber}`)
  }

  orders.unshift(order)
  setItem(KEY, orders)

  return order
}

// ─── Update Status ────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  note?: string,
): Promise<Order> {
  await simulateDelay()
  const orders = getItem<Order[]>(KEY) ?? []
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) throw new Error(`Order ${id} not found`)

  const order = orders[idx]
  if (!canTransition(order.status, newStatus)) {
    throw new Error(`Cannot move order from "${order.status}" to "${newStatus}"`)
  }

  const entry: StatusHistoryEntry = { status: newStatus, timestamp: now(), note }
  const updated: Order = {
    ...order,
    status: newStatus,
    statusHistory: [...order.statusHistory, entry],
    updatedAt: now(),
  }
  orders[idx] = updated
  setItem(KEY, orders)
  return updated
}

// ─── Cancel Order ─────────────────────────────────────────────────────────────

export async function cancelOrder(id: string, note?: string): Promise<Order> {
  const updated = await updateOrderStatus(id, 'cancelled', note)

  // Restore stock
  for (const item of updated.items) {
    _adjustStockSync(item.productId, item.quantity, `Cancelled order ${updated.orderNumber}`)
  }

  return updated
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getOrderStats(): Promise<OrderStats> {
  await simulateDelay()
  const orders = getItem<Order[]>(KEY) ?? []

  const todayOrders = orders.filter((o) => isToday(o.createdAt))
  const delivered = orders.filter((o) => o.status === 'delivered')
  const todayDelivered = todayOrders.filter((o) => o.status === 'delivered')

  const pending = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status),
  )

  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    totalRevenue: delivered.reduce((s, o) => s + o.total, 0),
    todayRevenue: todayDelivered.reduce((s, o) => s + o.total, 0),
    pendingOrders: pending.length,
    lowStockCount: 0, // populated by admin dashboard (avoids circular dep)
  }
}
