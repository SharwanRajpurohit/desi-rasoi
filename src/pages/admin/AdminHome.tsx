import { Link } from 'react-router-dom'
import { LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function AdminHome() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 bg-indigo p-6 text-white">
        <div className="mb-8 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-display text-lg font-bold">Admin</span>
        </div>
        <nav className="space-y-2 text-sm">
          <p className="rounded-md bg-brand px-3 py-2 font-medium">Dashboard</p>
          <p className="px-3 py-2 text-white/70">Products</p>
          <p className="px-3 py-2 text-white/70">Orders</p>
          <p className="px-3 py-2 text-white/70">Inventory</p>
        </nav>
      </aside>

      <main className="flex-1 bg-slate-50 p-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-brand hover:text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <h1 className="font-display text-3xl text-charcoal">Admin Dashboard</h1>
        <p className="mt-2 text-warm-gray">
          Product management, orders, and inventory — coming in Phase 4.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Orders', value: '—' },
            { label: 'Revenue', value: '—' },
            { label: 'Pending', value: '—' },
            { label: 'Low Stock', value: '—' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-white p-6 shadow-md">
              <p className="text-sm text-warm-gray">{kpi.label}</p>
              <p className="mt-2 text-3xl font-bold text-charcoal">{kpi.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
