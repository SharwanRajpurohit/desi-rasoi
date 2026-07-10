import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import type { Product } from '../../types'
import { getFeaturedProducts } from '../../services/products'
import { Button } from '../../components/ui/Button'
import { ProductCard } from '../../components/customer/ProductCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-indigo px-4 py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur mb-4">
            🏺 Traditional · Authentic · Rajasthani
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Taste of Rajasthan
          </h1>
          <p className="mt-2 font-hindi text-xl text-white/80">राजस्थान का स्वाद, आपके द्वार</p>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Authentic traditional food — from Ghevar to Ker Sangri — crafted in Rajasthani kitchens and delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" variant="secondary" icon={<ShoppingBag className="h-5 w-5" />}>
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
