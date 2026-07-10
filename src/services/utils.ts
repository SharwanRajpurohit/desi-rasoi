/** Simple 8-char random ID */
export function nanoid(prefix: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}_${id}`
}

/** Generate human-readable order number: DR-YYYYMMDD-XXXX */
export function generateOrderNumber(existingOrders: number): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(existingOrders + 1).padStart(4, '0')
  return `DR-${date}-${seq}`
}

/** ISO timestamp */
export const now = (): string => new Date().toISOString()

/** Simulate async latency (makes UI loading states testable) */
export const simulateDelay = (ms = 40): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/** Today's date as YYYY-MM-DD */
export const todayStr = (): string => new Date().toISOString().slice(0, 10)

/** Check if ISO timestamp is from today */
export const isToday = (iso: string): boolean =>
  iso.startsWith(todayStr())
