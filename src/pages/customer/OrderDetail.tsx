import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Phone, Package } from 'lucide-react'
import type { Order } from '../../types'
import { getOrderById } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import { OrderTimeline } from '../../components/customer/OrderTimeline'
import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  placed: 'info', confirmed: 'info', preparing: 'warning',
  out_for_delivery: 'warning', delivered: 'success', cancelled: 'error',
}
const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}

function estimatedDelivery(createdAt: string): string {
  const d = new Date(createdAt)
  d.setDate(d.getDate() + 3)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { customer } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getOrderById(id).then((o) => {
      if (!o || (customer && o.customerId !== customer.id)) {
        navigate('/orders', { replace: true })
        return
      }
      setOrder(o)
      setLoading(false)
    })
  }, [id, customer, navigate])

  // Poll for status updates every 5 seconds (simulates real-time)
  useEffect(() => {
    if (!id) return
    const interval = setInterval(() => {
      getOrderById(id).then((o) => { if (o) setOrder(o) })
    }, 5000)
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-warm-gray">
        <Link to="/orders" className="hover:text-brand">My Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status] ?? 'default'}>
          {STATUS_LABEL[order.status] ?? order.status}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-card overflow-x-auto">
        <h2 className="mb-6 font-semibold text-charcoal">Order Status</h2>
        <OrderTimeline currentStatus={order.status} history={order.statusHistory} />
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <p className="mt-6 text-center text-xs text-warm-gray">
            Estimated delivery by <strong>{estimatedDelivery(order.createdAt)}</strong>
          </p>
        )}
      </div>

      {/* Items */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-charcoal">
          Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal line-clamp-1">{item.productName}</p>
                <p className="text-xs text-warm-gray">₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity}</p>
              </div>
              <span className="font-bold text-charcoal">₹{item.lineTotal.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-sand-dark pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-warm-gray">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-warm-gray">
            <span>Delivery</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-charcoal text-base">
            <span>Total</span>
            <span>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-warm-gray">
            <span>Payment</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-charcoal">
          <MapPin className="h-4 w-4 text-brand" /> Delivery Address
        </h2>
        <p className="font-medium text-charcoal">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-warm-gray mt-1">
          {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
        </p>
        <p className="text-sm text-warm-gray">
          {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm text-warm-gray">
          <Phone className="h-3 w-3" /> {order.shippingAddress.phone}
        </p>
        {order.shippingAddress.notes && (
          <p className="mt-2 text-xs italic text-warm-gray">Note: {order.shippingAddress.notes}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" icon={<Package className="h-4 w-4" />} onClick={() => navigate('/orders')}>
          All Orders
        </Button>
        <Button icon={<Package className="h-4 w-4" />} onClick={() => navigate('/products')}>
          Shop Again
        </Button>
      </div>
    </div>
  )
}
