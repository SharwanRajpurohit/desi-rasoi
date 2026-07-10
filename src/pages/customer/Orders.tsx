import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import type { Order } from '../../types'
import { getOrdersByCustomer } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  placed: 'info', confirmed: 'info', preparing: 'warning',
  out_for_delivery: 'warning', delivered: 'success', cancelled: 'error',
}

export default function Orders() {
  const { customer } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customer) return
    getOrdersByCustomer(customer.id).then((o) => { setOrders(o); setLoading(false) })
  }, [customer])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 font-display text-3xl text-charcoal">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No orders yet"
          description="Your order history will appear here once you place your first order."
          action={{ label: 'Start Shopping', onClick: () => navigate('/products') }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card hover:shadow-md transition group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sand text-brand">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-charcoal">{order.orderNumber}</span>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'default'} size="sm">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-warm-gray">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-warm-gray mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-warm-gray group-hover:text-brand transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
