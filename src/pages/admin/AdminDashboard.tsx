import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, IndianRupee, AlertTriangle, ChevronRight } from 'lucide-react'
import { getOrderStats, getOrders } from '../../services/orders'
import { getLowStockProducts } from '../../services/products'
import type { OrderStats, Order, Product } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { RevenueChart } from '../../components/admin/RevenueChart'

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  title,
  value,
  sub,
  color,
}: {
  icon: typeof Package
  title: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-warm-gray">{title}</p>
      <p className="mt-1 text-3xl font-bold text-charcoal">{value}</p>
      {sub && <p className="mt-1 text-xs text-warm-gray">{sub}</p>}
    </div>
  )
}

// ─── Status badge map ─────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'error'> = {
  placed: 'info',
  confirmed: 'info',
  preparing: 'warning',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'error',
}

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStock, setLowStock] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOrderStats(),
      getOrders(),
      getLowStockProducts(),
    ]).then(([s, orders, ls]) => {
      setStats({ ...s, lowStockCount: ls.length })
      setRecentOrders(orders.slice(0, 8))
      setLowStock(ls.slice(0, 5))
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Dashboard</h1>
        <p className="text-sm text-warm-gray">Overview of your store</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))
        ) : (
          <>
            <KpiCard icon={Package}      title="Total Orders"   value={stats?.totalOrders ?? 0}   sub={`${stats?.todayOrders ?? 0} today`}          color="bg-blue-100 text-blue-600" />
            <KpiCard icon={IndianRupee}  title="Revenue"        value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`} sub="delivered orders" color="bg-green-100 text-green-600" />
            <KpiCard icon={Package}      title="Pending Orders" value={stats?.pendingOrders ?? 0} sub="needs attention"             color="bg-amber-100 text-amber-600" />
            <KpiCard icon={AlertTriangle} title="Low Stock Items" value={stats?.lowStockCount ?? 0} sub="< 10 units left"            color="bg-red-100 text-red-600" />
          </>
        )}
      </div>

      {/* Revenue chart */}
      {!loading && <RevenueChart orders={recentOrders} />}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-sand-dark px-6 py-4">
            <h2 className="font-semibold text-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-sand-dark">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24 flex-1" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-warm-gray">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-sand/50 transition-colors"
                >
                  <span className="text-xs font-mono text-warm-gray w-28 shrink-0">{order.orderNumber}</span>
                  <span className="flex-1 truncate text-sm text-charcoal">{order.customerName}</span>
                  <span className="text-sm font-medium text-charcoal">₹{order.total.toLocaleString('en-IN')}</span>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'default'} size="sm">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-sand-dark px-6 py-4">
            <h2 className="font-semibold text-charcoal">Low Stock</h2>
            <Link to="/admin/inventory" className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark">
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-sand-dark">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              ))
            ) : lowStock.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-warm-gray">All stock levels healthy ✓</p>
            ) : (
              lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-charcoal truncate">{p.nameEn}</span>
                  <Badge variant={p.stock === 0 ? 'error' : 'warning'} size="sm">
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
