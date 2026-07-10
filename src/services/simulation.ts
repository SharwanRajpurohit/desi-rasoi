/**
 * Order status auto-simulation for demo purposes.
 *
 * Placed orders advance through the pipeline automatically:
 *   placed       → confirmed       after ~20 s
 *   confirmed    → preparing       after ~50 s total
 *   preparing    → out_for_delivery after ~100 s total
 *   out_for_delivery → delivered   after ~160 s total
 *
 * The timer fires every 8 seconds and checks all non-final orders.
 */

import type { Order, OrderStatus } from '../types'
import { getItem, setItem } from './storage'
import { now } from './utils'

const ORDERS_KEY = 'orders'

const ADVANCE_AFTER_MS: Partial<Record<OrderStatus, number>> = {
  placed:           20_000,
  confirmed:        30_000,
  preparing:        50_000,
  out_for_delivery: 60_000,
}

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  placed:           'confirmed',
  confirmed:        'preparing',
  preparing:        'out_for_delivery',
  out_for_delivery: 'delivered',
}

const NOTES: Partial<Record<OrderStatus, string>> = {
  confirmed:        'Order confirmed by the store',
  preparing:        'Your order is being freshly prepared',
  out_for_delivery: 'Out for delivery — expect arrival soon',
  delivered:        'Delivered! Enjoy your food 🎉',
}

let timer: ReturnType<typeof setInterval> | null = null

function tick() {
  const orders: Order[] = getItem<Order[]>(ORDERS_KEY) ?? []
  const ts = Date.now()
  let changed = false

  const updated = orders.map((order) => {
    const delayMs = ADVANCE_AFTER_MS[order.status]
    const next    = NEXT[order.status]
    if (!delayMs || !next) return order

    const sinceLastUpdate = ts - new Date(order.updatedAt).getTime()
    if (sinceLastUpdate < delayMs) return order

    const entry = { status: next, timestamp: now(), note: NOTES[next] }
    changed = true
    return {
      ...order,
      status: next,
      statusHistory: [...order.statusHistory, entry],
      updatedAt: now(),
    } satisfies Order
  })

  if (changed) {
    setItem(ORDERS_KEY, updated)
    window.dispatchEvent(new Event('desi-rasoi:orders-updated'))
  }
}

export function startOrderSimulation(): void {
  if (timer) return
  tick()
  timer = setInterval(tick, 8_000)
}

export function stopOrderSimulation(): void {
  if (timer) { clearInterval(timer); timer = null }
}
