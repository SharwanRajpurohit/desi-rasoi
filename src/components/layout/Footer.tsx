import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-sand-dark bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <ChefHat className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-charcoal">Desi Rasoi</span>
            </div>
            <p className="font-hindi text-sm text-warm-gray">राजस्थान का स्वाद, आपके द्वार</p>
            <p className="mt-2 text-xs text-warm-gray">
              Authentic traditional Rajasthani food products delivered to your door.
            </p>
            <p className="mt-4 inline-flex rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
              ⚠ Demo mode — not for production use
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-warm-gray">
              <li><Link to="/products" className="hover:text-brand transition-colors">All Products</Link></li>
              <li><Link to="/categories/sweets" className="hover:text-brand transition-colors">Sweets & Mithai</Link></li>
              <li><Link to="/categories/snacks" className="hover:text-brand transition-colors">Snacks & Namkeen</Link></li>
              <li><Link to="/categories/gift-hampers" className="hover:text-brand transition-colors">Gift Hampers</Link></li>
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-warm-gray">
              <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
              <li><Link to="/orders" className="hover:text-brand transition-colors">Track Order</Link></li>
              <li>
                <Link to="/admin" className="hover:text-indigo transition-colors text-indigo/70">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-sand-dark pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-warm-gray">© 2026 Desi Rasoi. MIT License.</p>
          <p className="text-xs text-warm-gray">
            Built with React + Vite · Hosted on GitHub Pages
          </p>
        </div>
      </div>
    </footer>
  )
}
