import { useEffect, useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { Product, Category } from '../../types'
import { getAllProducts, adjustStock } from '../../services/products'
import { getAllCategories } from '../../services/categories'
import { useToast } from '../../context/ToastContext'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

function stockVariant(stock: number) {
  if (stock === 0) return 'error'
  if (stock <= 10) return 'warning'
  return 'success'
}

interface RowState { adjusting: boolean; delta: string }

export default function AdminInventory() {
  const { success, error } = useToast()

  const [products, setProducts]     = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [rowState, setRowState]     = useState<Record<string, RowState>>({})

  const load = async () => {
    const [prods, cats] = await Promise.all([getAllProducts(), getAllCategories()])
    setProducts(prods.filter((p) => p.active))
    setCategories(cats)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const catName = (id: string) => categories.find((c) => c.id === id)?.nameEn ?? '—'

  const getRow = (id: string): RowState => rowState[id] ?? { adjusting: false, delta: '' }

  const setRow = (id: string, partial: Partial<RowState>) =>
    setRowState((s) => ({ ...s, [id]: { ...getRow(id), ...partial } }))

  const handleAdjust = async (product: Product, delta: number) => {
    if (delta === 0) return
    setRow(product.id, { adjusting: true })
    try {
      const updated = await adjustStock(product.id, delta, 'Manual admin adjustment')
      setProducts((prev) => prev.map((p) => p.id === product.id ? updated : p))
      success(`${product.nameEn}: stock ${delta > 0 ? '+' : ''}${delta} → ${updated.stock} units`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Adjustment failed')
    } finally {
      setRow(product.id, { adjusting: false, delta: '' })
    }
  }

  const handleDirectSet = async (product: Product) => {
    const delta = parseInt(getRow(product.id).delta, 10)
    if (isNaN(delta) || delta === 0) return
    await handleAdjust(product, delta)
  }

  const lowStock = products.filter((p) => p.stock <= 10)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-charcoal">Inventory</h1>
        <p className="text-sm text-warm-gray">Manage stock levels across all active products</p>
      </div>

      {/* Low stock alert */}
      {!loading && lowStock.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            ⚠ {lowStock.length} product{lowStock.length !== 1 ? 's' : ''} running low on stock
          </p>
          <p className="mt-1 text-xs text-amber-700">
            {lowStock.map((p) => p.nameEn).join(' · ')}
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-warm-gray">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3 hidden md:table-cell">Category</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Quick Adjust</th>
              <th className="px-5 py-3 hidden sm:table-cell">Custom</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>{[1,2,3,4,5].map((j) => <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>)}</tr>
              ))
            ) : (
              products.map((p) => {
                const row = getRow(p.id)
                return (
                  <tr key={p.id} className={`transition-colors ${p.stock === 0 ? 'bg-red-50/30' : p.stock <= 10 ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-charcoal line-clamp-1">{p.nameEn}</p>
                      <p className="font-hindi text-xs text-warm-gray">{p.nameHi}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-warm-gray text-xs">{catName(p.categoryId)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-charcoal">{p.stock}</span>
                        <Badge variant={stockVariant(p.stock)} size="sm">
                          {p.stock === 0 ? 'Out' : p.stock <= 10 ? 'Low' : 'OK'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjust(p, -1)}
                          disabled={row.adjusting || p.stock === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-warm-gray hover:border-royal hover:text-royal disabled:opacity-40 transition-colors"
                          title="-1"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleAdjust(p, -10)}
                          disabled={row.adjusting || p.stock < 10}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-warm-gray hover:border-royal hover:text-royal disabled:opacity-40 transition-colors"
                          title="-10"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleAdjust(p, 10)}
                          disabled={row.adjusting}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-warm-gray hover:border-green-500 hover:text-green-600 disabled:opacity-40 transition-colors"
                          title="+10"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAdjust(p, 1)}
                          disabled={row.adjusting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-warm-gray hover:border-green-500 hover:text-green-600 disabled:opacity-40 transition-colors"
                          title="+1"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={row.delta}
                          onChange={(e) => setRow(p.id, { delta: e.target.value })}
                          placeholder="±qty"
                          className="h-8 w-20 rounded-lg border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                        <button
                          onClick={() => handleDirectSet(p)}
                          disabled={row.adjusting || !row.delta}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-40 transition-colors"
                          title="Apply"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
