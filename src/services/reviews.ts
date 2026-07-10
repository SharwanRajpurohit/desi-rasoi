import type { Review } from '../types'
import { getItem, setItem } from './storage'
import { nanoid, now, simulateDelay } from './utils'

const KEY = 'reviews'

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  await simulateDelay(50)
  return (getItem<Review[]>(KEY) ?? [])
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function addReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await simulateDelay(80)
  const reviews = getItem<Review[]>(KEY) ?? []
  const review: Review = { ...data, id: nanoid('rev'), createdAt: now() }
  reviews.unshift(review)
  setItem(KEY, reviews)
  return review
}

export function hasReviewed(productId: string, customerId: string): boolean {
  return (getItem<Review[]>(KEY) ?? []).some(
    (r) => r.productId === productId && r.customerId === customerId,
  )
}

export function getAverageRating(productId: string): { avg: number; count: number } {
  const all = (getItem<Review[]>(KEY) ?? []).filter((r) => r.productId === productId)
  if (all.length === 0) return { avg: 0, count: 0 }
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length
  return { avg: Math.round(avg * 10) / 10, count: all.length }
}

// Seed initial reviews — called once by seed.ts
export function _seedReviews(reviews: Review[]): void {
  const existing = getItem<Review[]>(KEY)
  if (!existing) setItem(KEY, reviews)
}
