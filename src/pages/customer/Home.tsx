import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const CATEGORIES = [
  { slug: 'sweets',       icon: '🍬', nameEn: 'Sweets & Mithai',   nameHi: 'मिठाई' },
  { slug: 'snacks',       icon: '🥨', nameEn: 'Snacks & Namkeen',  nameHi: 'नमकीन' },
  { slug: 'pickles',      icon: '🫙', nameEn: 'Pickles & Chutney', nameHi: 'अचार' },
  { slug: 'spices',       icon: '🌶️', nameEn: 'Spices & Masala',   nameHi: 'मसाले' },
  { slug: 'grains',       icon: '🌾', nameEn: 'Grains & Pulses',   nameHi: 'अनाज और दाल' },
  { slug: 'ready-to-eat', icon: '🍽️', nameEn: 'Ready to Eat',      nameHi: 'तैयार भोजन' },
  { slug: 'beverages',    icon: '🥤', nameEn: 'Beverages',         nameHi: 'पेय' },
  { slug: 'gift-hampers', icon: '🎁', nameEn: 'Gift Hampers',      nameHi: 'गिफ्ट हैम्पर' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-indigo px-4 py-20 text-white">
        {/* Decorative pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/90 backdrop-blur mb-4">
            🏺 Traditional • Authentic • Rajasthani
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
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
          >
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

      {/* Featured placeholder — Phase 3 will load real products */}
      <section className="bg-sand-dark/40 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Handpicked</p>
            <h2 className="mt-1 font-display text-2xl text-charcoal">Featured Products</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Ghevar', 'Bikaneri Bhujia', 'Dal Baati Churma Kit', 'Thandai Mix'].map((name) => (
              <div key={name} className="rounded-xl bg-white p-4 shadow-card">
                <div className="mb-3 flex h-36 items-center justify-center rounded-lg bg-sand text-4xl">
                  🍽️
                </div>
                <p className="font-display text-sm font-semibold text-charcoal">{name}</p>
                <p className="text-xs text-warm-gray">Loading in Phase 3…</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/products">
              <Button variant="outline" icon={<ShoppingBag className="h-4 w-4" />}>
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage story */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Our Heritage</p>
        <h2 className="mt-2 font-display text-2xl text-charcoal">
          From the Kitchens of Rajasthan
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-warm-gray">
          Every product we carry is rooted in centuries of Rajasthani culinary tradition.
          From the royal kitchens of Jaipur to the desert haveli of Jodhpur — we bring
          authentic flavours made with time-honoured recipes and locally sourced ingredients.
        </p>
        <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
          Read our story <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
