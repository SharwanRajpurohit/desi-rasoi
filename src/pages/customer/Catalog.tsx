import { useEffect, useState, useCallback } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Product, Category, SortOption } from '../../types'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { ProductGrid } from '../../components/customer/ProductGrid'
import { FilterChips } from '../../components/customer/FilterChips'
import { Select } from '../../components/ui/Select'

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'name_asc',  label: 'Name: A to Z' },
]

export default function Catalog() {
  useDocumentTitle('All Products')
  const [products, setProducts]     = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categorySlug, setCategorySlug]       = useState('')
  const [sort, setSort]             = useState<SortOption>('newest')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const cat = categories.find((c) => c.slug === categorySlug)
    const data = await getProducts({
      categoryId: cat?.id,
      search: debouncedSearch || undefined,
      sort,
    })
    setProducts(data)
    setLoading(false)
  }, [categories, categorySlug, debouncedSearch, sort])

  useEffect(() => { load() }, [load])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Shop</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal">All Products</h1>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="h-10 w-full rounded-lg border border-sand-dark bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-warm-gray" />
          <Select
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-44"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-6 overflow-x-auto pb-2">
        <FilterChips
          categories={categories}
          selected={categorySlug}
          onChange={setCategorySlug}
        />
      </div>

      {/* Count */}
      {!loading && (
        <p className="mb-4 text-sm text-warm-gray">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle="No products found"
        emptyDescription="Try a different search term or category."
      />
    </div>
  )
}


