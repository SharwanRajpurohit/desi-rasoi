import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { CartSummary, ShippingAddress } from '../../types'
import { getCartSummary } from '../../services/cart'
import { createOrder } from '../../services/orders'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh',
].map((s) => ({ value: s, label: s }))

export default function Checkout() {
  const { customer } = useAuth()
  const { cart, clearCart } = useCart()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const [summary, setSummary]   = useState<CartSummary | null>(null)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<ShippingAddress>({
    fullName: customer?.name ?? '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})

  useEffect(() => {
    getCartSummary().then((s) => {
      if (!s || s.items.length === 0) { navigate('/cart', { replace: true }); return }
      setSummary(s)
      setLoading(false)
    })
  }, [navigate, cart])

  const set = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e: Partial<ShippingAddress> = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10-digit mobile number required'
    if (!form.line1.trim()) e.line1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit PIN code required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || !summary || !customer) return
    setSubmitting(true)
    try {
      const order = await createOrder(cart, form, customer)
      clearCart()
      success(`Order ${order.orderNumber} placed successfully!`)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-48" />
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-display text-3xl text-charcoal">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Delivery form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-charcoal">
              <MapPin className="h-5 w-5 text-brand" /> Delivery Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Full Name" required value={form.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="As on ID" />
              </div>
              <div className="sm:col-span-2">
                <Input label="Mobile Number" required type="tel" maxLength={10} value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="10-digit mobile" />
              </div>
              <div className="sm:col-span-2">
                <Input label="Address Line 1" required value={form.line1} onChange={set('line1')} error={errors.line1} placeholder="House / Flat / Block no." />
              </div>
              <div className="sm:col-span-2">
                <Input label="Address Line 2" value={form.line2} onChange={set('line2')} placeholder="Street, Area, Landmark (optional)" />
              </div>
              <Input label="City" required value={form.city} onChange={set('city')} error={errors.city} />
              <Select
                label="State"
                required
                value={form.state}
                onChange={set('state')}
                options={INDIAN_STATES}
              />
              <Input label="PIN Code" required maxLength={6} value={form.pincode} onChange={set('pincode')} error={errors.pincode} placeholder="6-digit PIN" />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-charcoal">Delivery Notes</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                rows={2}
                className="mt-1 w-full rounded-lg border border-sand-dark px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="e.g. Leave at gate, Call before delivery (optional)"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <h2 className="mb-3 font-semibold text-charcoal">Payment Method</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" defaultChecked className="h-4 w-4 accent-brand" />
              <span className="text-sm font-medium text-charcoal">💵 Cash on Delivery (COD)</span>
            </label>
            <p className="mt-1 ml-7 text-xs text-warm-gray">Pay when your order arrives. No extra charges.</p>
          </div>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg text-charcoal">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {summary?.items.map(({ product, quantity, lineTotal }) => (
              <div key={product.id} className="flex justify-between gap-2">
                <span className="text-warm-gray line-clamp-1 flex-1">{product.nameEn} × {quantity}</span>
                <span className="shrink-0 font-medium text-charcoal">₹{lineTotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-sand-dark pt-3 space-y-1">
              <div className="flex justify-between text-warm-gray">
                <span>Subtotal</span>
                <span>₹{summary?.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>Delivery</span>
                <span>₹{summary?.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-charcoal text-base pt-1">
                <span>Total</span>
                <span>₹{summary?.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <Button type="submit" fullWidth size="lg" loading={submitting} className="mt-6">
            Place Order
          </Button>
          <p className="mt-3 text-center text-xs text-warm-gray">
            By placing your order you agree to our demo terms.
          </p>
        </div>
      </form>
    </div>
  )
}
