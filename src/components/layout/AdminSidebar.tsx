import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Warehouse,
  Tags,
  LogOut,
  ChefHat,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: Package, label: 'Orders' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
]

export function AdminSidebar() {
  const { adminLogout } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    adminLogout()
    success('Logged out of admin panel')
    navigate('/admin/login')
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-indigo text-white">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <ChefHat className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight">Desi Rasoi</p>
          <p className="text-[10px] text-white/50">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View Store
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
