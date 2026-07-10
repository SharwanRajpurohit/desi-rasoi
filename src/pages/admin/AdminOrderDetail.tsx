import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight, MapPin, Phone } from 'lucide-react'
import type { Order, OrderStatus } from '../../types'
import { getOrderById, updateOrderStatus, cancelOrder, canTransition } from '../../services/orders'
import { useToast } from '../../context/ToastContext'
import { Badge, type BadgeVariant } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  placed: 'info', confirmed: 'info', preparing: 'warning',
  out_for_delivery: 'warning', delivered: 'success', cancelled: 'error',
}

const ALL_STATUSES: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [order, setOrder]     = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    if (!id) return
    getOrderById(id).then((o) => {
      if (!o) { navigate('/admin/orders'); return }
      setOrder(o)
      setLoading(false)
    })
  }
  useEffect(load, [id, navigate])

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return
    setUpdating(true)
    try {
      const updated = await updateOrderStatus(order.id, newStatus)
      setOrder(updated)
      success(`Order status → ${STATUS_LABEL[newStatus]}`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!order) return
    setCancelling(true)
    try {
      const updated = await cancelOrder(order.id, 'Cancelled by admin')
      setOrder(updated)
      success('Order cancelled. Stock restored.')
      setCancelOpen(false)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Cancel failed')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl space-y-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
  if (!order) return null

  const isFinal = order.status === 'delivered' || order.status === 'cancelled'
  const nextStatuses = ALL_STATUSES.filter((s) => canTransition(order.status, s))

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-warm-gray">
        <Link to="/admin/orders" className="hover:text-brand">Orders</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-charcoal">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{order.orderNumber}</h1>
          <p className="text-sm text-warm-gray">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status] ?? 'default'}>
          {STATUS_LABEL[order.status] ?? order.status}
        </Badge>
      </div>

      {/* Status update panel */}
      {!isFinal && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-charcoal">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={s === 'delivered' ? 'primary' : 'outline'}
                loading={updating}
                onClick={() => handleStatusChange(s)}
              >
                → {STATUS_LABEL[s]}
              </Button>
            ))}
            {canTransition(order.status, 'cancelled') && (
              <Button size="sm" variant="danger" onClick={() => setCancelOpen(true)}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-charcoal">
          Items · {order.items.reduce((s, i) => s + i.quantity, 0)} units
        </h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal line-clamp-1">{item.productName}</p>
                <p className="text-xs text-warm-gray">₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity}</p>
              </div>
              <span className="font-bold text-charcoal">₹{item.lineTotal.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-warm-gray"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-warm-gray"><span>Delivery</span><span>₹{order.deliveryFee}</span></div>
          <div className="flex justify-between font-bold text-charcoal text-base"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
        </div>
      </div>

      {/* Customer + Address */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold text-charcoal">Customer</h2>
          <p className="font-medium text-charcoal">{order.customerName}</p>
          <p className="text-sm text-warm-gray">{order.customerEmail}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-warm-gray">
            <Phone className="h-3 w-3" />{order.shippingAddress.phone}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 flex items-center gap-1 font-semibold text-charcoal">
            <MapPin className="h-4 w-4 text-brand" /> Delivery Address
          </h2>
          <p className="text-sm text-charcoal">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
          <p className="text-sm text-warm-gray">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
          {order.shippingAddress.notes && <p className="mt-1 text-xs italic text-warm-gray">{order.shippingAddress.notes}</p>}
        </div>
      </div>

      {/* Status history */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-charcoal">Status History</h2>
        <ol className="space-y-2">
          {[...order.statusHistory].reverse().map((h, i) => (
            <li key={i} className="flex items-start gap-3">
              <Badge variant={STATUS_VARIANT[h.status] ?? 'default'} size="sm">{STATUS_LABEL[h.status] ?? h.status}</Badge>
              <span className="text-xs text-warm-gray mt-0.5">
                {new Date(h.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                {h.note ? ` — ${h.note}` : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cancel confirm */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Order">
        <div className="space-y-4">
          <p className="text-sm text-warm-gray">
            Cancel <strong>{order.orderNumber}</strong>? Stock will be restored automatically.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep Order</Button>
            <Button variant="danger" loading={cancelling} onClick={handleCancel}>Cancel Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
