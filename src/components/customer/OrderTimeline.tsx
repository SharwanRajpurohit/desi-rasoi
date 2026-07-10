import clsx from 'clsx'
import type { OrderStatus, StatusHistoryEntry } from '../../types'

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'placed',           label: 'Placed' },
  { status: 'confirmed',        label: 'Confirmed' },
  { status: 'preparing',        label: 'Preparing' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered',        label: 'Delivered' },
]

const STATUS_ORDER: Record<OrderStatus, number> = {
  placed: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
}

interface OrderTimelineProps {
  currentStatus: OrderStatus
  history: StatusHistoryEntry[]
}

export function OrderTimeline({ currentStatus, history }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
        <p className="text-sm font-semibold text-royal">This order was cancelled</p>
        {history.find((h) => h.status === 'cancelled')?.note && (
          <p className="mt-1 text-xs text-warm-gray">
            {history.find((h) => h.status === 'cancelled')?.note}
          </p>
        )}
      </div>
    )
  }

  const currentIdx = STATUS_ORDER[currentStatus]

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-sand-dark" aria-hidden />
      <div
        className="absolute top-4 left-4 h-0.5 bg-brand transition-all duration-500"
        style={{ right: `${((4 - currentIdx) / 4) * 100}%` }}
        aria-hidden
      />

      {/* Steps */}
      <ol className="relative flex justify-between">
        {STEPS.map((step, idx) => {
          const done = idx <= currentIdx
          const active = idx === currentIdx
          const entry = history.find((h) => h.status === step.status)
          return (
            <li key={step.status} className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  done
                    ? 'border-brand bg-brand text-white'
                    : 'border-sand-dark bg-white text-warm-gray',
                  active && 'ring-4 ring-brand/20',
                )}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <div className="text-center">
                <p className={clsx('text-xs font-semibold', done ? 'text-brand' : 'text-warm-gray')}>
                  {step.label}
                </p>
                {entry && (
                  <p className="text-[10px] text-warm-gray mt-0.5">
                    {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
