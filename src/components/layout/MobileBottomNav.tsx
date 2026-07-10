import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const LINKS = [
  { to: '/',         label: 'Home',     icon: Home,        end: true  },
  { to: '/products', label: 'Shop',     icon: ShoppingBag, end: false },
  { to: '/cart',     label: 'Cart',     icon: ShoppingCart,end: false },
  { to: '/wishlist', label: 'Saved',    icon: Heart,       end: false },
  { to: '/orders',   label: 'Orders',   icon: User,        end: false },
]

export function MobileBottomNav() {
  const { itemCount }    = useCart()
  const { count: wishlistCount } = useWishlist()

  const badge: Record<string, number> = {
    '/cart': itemCount,
    '/wishlist': wishlistCount,
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-sand-dark bg-white/95 backdrop-blur-sm md:hidden print:hidden">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
              isActive ? 'text-brand' : 'text-warm-gray',
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon className={clsx('h-5 w-5', isActive && to === '/wishlist' && 'fill-current')} />
                {badge[to] > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                    {badge[to] > 9 ? '9+' : badge[to]}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
