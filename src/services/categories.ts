import type { Category } from '../types'
import { getItem, setItem } from './storage'
import { nanoid, now, simulateDelay } from './utils'

const KEY = 'categories'

export async function getCategories(): Promise<Category[]> {
  await simulateDelay()
  return (getItem<Category[]>(KEY) ?? [])
    .filter((c) => c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getAllCategories(): Promise<Category[]> {
  await simulateDelay()
  return (getItem<Category[]>(KEY) ?? []).sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await simulateDelay()
  return (getItem<Category[]>(KEY) ?? []).find((c) => c.slug === slug) ?? null
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await simulateDelay()
  return (getItem<Category[]>(KEY) ?? []).find((c) => c.id === id) ?? null
}

export async function createCategory(
  data: Omit<Category, 'id'>,
): Promise<Category> {
  await simulateDelay()
  const categories = getItem<Category[]>(KEY) ?? []
  const slug = data.slug.toLowerCase().replace(/\s+/g, '-')
  if (categories.some((c) => c.slug === slug)) {
    throw new Error(`Category slug "${slug}" already exists`)
  }
  const category: Category = { ...data, id: nanoid('cat'), slug }
  categories.push(category)
  setItem(KEY, categories)
  return category
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, 'id'>>,
): Promise<Category> {
  await simulateDelay()
  const categories = getItem<Category[]>(KEY) ?? []
  const idx = categories.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error(`Category ${id} not found`)
  const updated = { ...categories[idx], ...data }
  categories[idx] = updated
  setItem(KEY, categories)
  return updated
}

export async function deleteCategory(id: string): Promise<void> {
  await simulateDelay()
  const categories = getItem<Category[]>(KEY) ?? []
  const idx = categories.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error(`Category ${id} not found`)
  categories.splice(idx, 1)
  setItem(KEY, categories)
}

// Sync helper used internally by seed
export function _setCategoriesSync(categories: Category[]): void {
  setItem(KEY, categories)
}

// Used internally for timestamp tracking
export { now }
