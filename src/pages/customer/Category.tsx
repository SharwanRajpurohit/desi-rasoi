import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Product, Category as CategoryType } from '../../types'
import { getProducts } from '../../services/products'
import { getCategoryBySlug, getCategories } from '../../services/categories'
import { ProductGrid } from '../../components/customer/ProductGrid'
import { FilterChips } from '../../components/customer/FilterChips'

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [category, setCategory]   = useState<CategoryType | null>(null)
  const [products, setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([getCategoryBySlug(slug), getCategories()]).then(([cat, cats]) => {
      if (!cat) { navigate('/products', { replace: true }); return }
      setCategory(cat)
      setCategories(cats)
      return getProducts({ categoryId: cat.id })
    }).then((prods) => {
      if (prods) setProducts(prods)
      setLoading(false)
    })
  }, [slug, navigate])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-warm-gray">
        <Link to="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-brand">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal">{category?.nameEn ?? slug}</span>
      </nav>

      <div className="mb-6">
        <p className="text-3xl">{category?.icon}</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal">{category?.nameEn}</h1>
        <p className="font-hindi mt-1 text-warm-gray">{category?.nameHi}</p>
      </div>

      {/* Switch category chips */}
      <div className="mb-6 overflow-x-auto pb-2">
        <FilterChips
          categories={categories}
          selected={slug ?? ''}
          onChange={(s) => s ? navigate(`/categories/${s}`) : navigate('/products')}
        />
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle={`No products in ${category?.nameEn ?? 'this category'}`}
        emptyDescription="Check back soon or browse all products."
      />
    </div>
  )
}
