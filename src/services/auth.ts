import type { Customer, AdminSession } from '../types'
import { getItem, setItem, removeItem } from './storage'
import { nanoid, now, simulateDelay } from './utils'

const CUSTOMER_KEY = 'customer'
const ADMIN_KEY = 'admin_session'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'desirasoi2026'

// ─── Customer Auth ────────────────────────────────────────────────────────────

/**
 * Login or auto-register a customer by email.
 * For the demo, any email creates a new account on first use.
 */
export async function loginCustomer(email: string, name: string): Promise<Customer> {
  await simulateDelay(80)

  const normalised = email.toLowerCase().trim()
  if (!normalised || !name.trim()) {
    throw new Error('Email and name are required')
  }

  const customer: Customer = {
    id: nanoid('cust'),
    email: normalised,
    name: name.trim(),
    createdAt: now(),
  }
  setItem(CUSTOMER_KEY, customer)
  return customer
}

export function logoutCustomer(): void {
  removeItem(CUSTOMER_KEY)
}

export function getCurrentCustomer(): Customer | null {
  return getItem<Customer>(CUSTOMER_KEY)
}

export function isCustomerLoggedIn(): boolean {
  return getCurrentCustomer() !== null
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  await simulateDelay(100)
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session: AdminSession = { loggedIn: true, username, timestamp: now() }
    setItem(ADMIN_KEY, session)
    return true
  }
  return false
}

export function logoutAdmin(): void {
  removeItem(ADMIN_KEY)
}

export function isAdminLoggedIn(): boolean {
  const session = getItem<AdminSession>(ADMIN_KEY)
  return session?.loggedIn === true
}

export function getAdminSession(): AdminSession | null {
  return getItem<AdminSession>(ADMIN_KEY)
}
