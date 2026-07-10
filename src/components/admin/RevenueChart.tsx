import type { Order } from '../../types'

interface RevenueChartProps { orders: Order[] }

function getLast7Days(): { label: string; dateStr: string }[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      dateStr: d.toISOString().slice(0, 10),
    })
  }
  return days
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const days = getLast7Days()

  const data = days.map(({ label, dateStr }) => {
    const revenue = orders
      .filter((o) => o.status === 'delivered' && o.createdAt.slice(0, 10) === dateStr)
      .reduce((s, o) => s + o.total, 0)
    return { label, revenue }
  })

  const max = Math.max(...data.map((d) => d.revenue), 1)

  const W = 360
  const H = 120
  const BAR_W = 36
  const GAP   = (W - days.length * BAR_W) / (days.length + 1)
  const PAD_T = 8
  const PAD_B = 28

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-charcoal">Revenue — Last 7 Days</h2>
      <svg width="100%" viewBox={`0 0 ${W} ${H + PAD_T + PAD_B}`} className="overflow-visible">
        {data.map((d, i) => {
          const barH = Math.max(4, ((d.revenue / max) * H))
          const x    = GAP + i * (BAR_W + GAP)
          const y    = PAD_T + H - barH
          return (
            <g key={d.label}>
              <rect
                x={x} y={y} width={BAR_W} height={barH} rx={6}
                className="fill-brand opacity-80 hover:opacity-100 transition-opacity"
              />
              {d.revenue > 0 && (
                <text
                  x={x + BAR_W / 2} y={y - 4}
                  textAnchor="middle"
                  className="fill-charcoal text-[8px] font-medium"
                  style={{ fontSize: 9 }}
                >
                  ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
                </text>
              )}
              <text
                x={x + BAR_W / 2} y={PAD_T + H + 18}
                textAnchor="middle"
                className="fill-warm-gray"
                style={{ fontSize: 10 }}
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
      {data.every((d) => d.revenue === 0) && (
        <p className="mt-2 text-center text-xs text-warm-gray">No delivered orders in the last 7 days</p>
      )}
    </div>
  )
}
