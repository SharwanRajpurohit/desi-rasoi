import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, ChefHat, LogOut, Heart, Search } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { SearchModal } from './SearchModal'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products', end: false },
  { to: '/about', label: 'About', end: false },
]

export function Header() {
  const { itemCount } = useCart()
  const { customer, signOut } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sand-dark bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-bold leading-tight text-charcoal">Desi Rasoi</p>
            <p className="font-hindi text-xs leading-none text-warm-gray">देसी रसोई</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-brand' : 'text-warm-gray hover:text-charcoal',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg border border-sand-dark bg-white px-3 text-sm text-warm-gray hover:border-brand hover:text-brand transition-colors"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline">⌘K</kbd>
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray hover:bg-sand hover:text-red-400 transition-colors"
            aria-label={`Wishlist — ${wishlistCount} items`}
          >
            <Heart className={clsx('h-5 w-5', wishlistCount > 0 && 'fill-red-400 text-red-400')} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[9px] font-bold text-white">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray hover:bg-sand hover:text-brand transition-colors"
            aria-label={`Cart — ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {customer ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/orders"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-warm-gray hover:bg-sand hover:text-charcoal transition-colors"
              >
                <User className="h-4 w-4" />
                {customer.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray hover:bg-sand hover:text-brand transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors md:flex"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray hover:bg-sand transition-colors md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Global search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-sand-dark bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-sand text-brand' : 'text-warm-gray hover:bg-sand hover:text-charcoal',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-sand-dark pt-2">
              {customer ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-warm-gray hover:bg-sand"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-royal hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
