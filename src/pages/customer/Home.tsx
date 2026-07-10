import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { getFeaturedProducts } from '../../services/products'
import { Button } from '../../components/ui/Button'
import { ProductCard } from '../../components/customer/ProductCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { HeroCarousel } from '../../components/customer/HeroCarousel'

const CATEGORIES = [
  { slug: 'sweets',       icon: '🍬', nameEn: 'Sweets & Mithai' },
  { slug: 'snacks',       icon: '🥨', nameEn: 'Snacks & Namkeen' },
  { slug: 'pickles',      icon: '🫙', nameEn: 'Pickles & Chutney' },
  { slug: 'spices',       icon: '🌶️', nameEn: 'Spices & Masala' },
  { slug: 'grains',       icon: '🌾', nameEn: 'Grains & Pulses' },
  { slug: 'ready-to-eat', icon: '🍽️', nameEn: 'Ready to Eat' },
  { slug: 'beverages',    icon: '🥤', nameEn: 'Beverages' },
  { slug: 'gift-hampers', icon: '🎁', nameEn: 'Gift Hampers' },
]

export default function Home() {
  useDocumentTitle()
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getFeaturedProducts().then((p) => { setFeatured(p.slice(0, 4)); setLoading(false) })
  }, [])

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Explore</p>
            <h2 className="mt-1 font-display text-2xl text-charcoal">Shop by Category</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center shadow-card transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-charcoal leading-tight group-hover:text-brand transition-colors">
                {cat.nameEn}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-sand-dark/40 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">Handpicked</p>
              <h2 className="mt-1 font-display text-2xl text-charcoal">Featured Products</h2>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
              All products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)
            }
          </div>

          <div className="mt-10 text-center">
            <Link to="/products">
              <Button variant="outline" icon={<ShoppingBag className="h-4 w-4" />}>
                Browse All 24 Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage story */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Our Heritage</p>
        <h2 className="mt-2 font-display text-2xl text-charcoal">From the Kitchens of Rajasthan</h2>
        <p className="mx-auto mt-4 max-w-2xl text-warm-gray">
          Every product we carry is rooted in centuries of Rajasthani culinary tradition.
          From the royal kitchens of Jaipur to the desert havelis of Jodhpur — we bring
          authentic flavours made with time-honoured recipes and locally sourced ingredients.
        </p>
        <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
          Read our story <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
