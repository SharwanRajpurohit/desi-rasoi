import { Link } from 'react-router-dom'
import { ShoppingBag, ChefHat } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-sand-dark bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-brand" />
            <div>
              <h1 className="font-display text-xl font-bold text-charcoal">Desi Rasoi</h1>
              <p className="font-hindi text-xs text-warm-gray">देसी रसोई</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <span className="text-brand">Home</span>
            <span className="text-warm-gray">Products</span>
            <span className="text-warm-gray">Cart</span>
            <Link to="/admin" className="text-indigo hover:text-indigo-light">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-brand to-marigold px-4 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Taste of Rajasthan
            </h2>
            <p className="mt-2 font-hindi text-lg opacity-90">राजस्थान का स्वाद, आपके द्वार</p>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
              Authentic traditional food products — from Ghevar to Ker Sangri, delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand shadow-md transition hover:bg-sand"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </button>
              <button
                type="button"
                className="rounded-lg border-2 border-white px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                View Categories
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Phase 0 Complete
          </p>
          <h3 className="mt-2 font-display text-2xl text-charcoal">
            React + Vite + Tailwind scaffold is ready
          </h3>
          <p className="mt-4 text-warm-gray">
            Customer catalog, cart, checkout, and admin panel coming in upcoming phases.
          </p>
        </section>
      </main>

      <footer className="border-t border-sand-dark bg-sand-dark/30 px-4 py-6 text-center text-sm text-warm-gray">
        <p>© 2026 Desi Rasoi — Demo Mode</p>
      </footer>
    </div>
  )
}
