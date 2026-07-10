import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import type { Order } from '../../types'
import { getOrders } from '../../services/orders'
import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  placed: 'info', confirmed: 'info', preparing: 'warning',
  out_for_delivery: 'warning', delivered: 'success', cancelled: 'error',
}

export default function AdminOrders() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    getOrders().then((o) => { setOrders(o); setLoading(false) })
  }, [])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q)
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-charcoal">Orders</h1>
        <p className="text-sm text-warm-gray">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or customer…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-52"
        />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-warm-gray">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3 hidden sm:table-cell">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 hidden md:table-cell">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{[1,2,3,4,5,6].map((j) => <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>)}</tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-warm-gray">No orders found.</td></tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold text-charcoal">{order.orderNumber}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="font-medium text-charcoal">{order.customerName}</p>
                    <p className="text-xs text-warm-gray">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-charcoal">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <Badge variant={STATUS_VARIANT[order.status] ?? 'default'} size="sm">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-xs text-warm-gray">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-xs font-medium text-brand hover:text-brand-dark"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
