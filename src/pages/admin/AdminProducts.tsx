import { useEffect, useState } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, AlertTriangle, Download } from 'lucide-react'
import type { Product, Category } from '../../types'
import { getAllProducts, deleteProduct } from '../../services/products'
import { getCategories } from '../../services/categories'
import { exportProductsCSV } from '../../services/export'
import { useToast } from '../../context/ToastContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { Select } from '../../components/ui/Select'

function stockVariant(stock: number) {
  if (stock === 0) return 'error'
  if (stock <= 10) return 'warning'
  return 'success'
}

export default function AdminProducts() {
  useDocumentTitle('Products � Admin')
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [products, setProducts]     = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting]     = useState(false)

  const load = async () => {
    const [prods, cats] = await Promise.all([getAllProducts(), getCategories()])
    setProducts(prods)
    setCategories(cats)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameHi.includes(search)
    const matchCat    = !catFilter || p.categoryId === catFilter
    return matchSearch && matchCat
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      success(`"${deleteTarget.nameEn}" deactivated`)
      setDeleteTarget(null)
      load()
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const catName = (id: string) => categories.find((c) => c.id === id)?.nameEn ?? '—'

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Products</h1>
          <p className="text-sm text-warm-gray">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={() => exportProductsCSV(filtered)}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/admin/products/new')}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <Select
          options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c.id, label: c.nameEn }))]}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="sm:w-52"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-warm-gray">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3 hidden md:table-cell">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3 hidden sm:table-cell">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {[1,2,3,4,5,6].map((j) => (
                    <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-full max-w-[120px]" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-warm-gray">
                  No products match your search.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <img src={p.imageUrl} alt={p.nameEn} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal line-clamp-1">{p.nameEn}</p>
                        <p className="font-hindi text-xs text-warm-gray">{p.nameHi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-warm-gray">{catName(p.categoryId)}</td>
                  <td className="px-5 py-4 font-medium text-charcoal">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <Badge variant={stockVariant(p.stock)} size="sm">
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <Badge variant={p.active ? 'success' : 'error'} size="sm">
                      {p.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-gray hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-gray hover:bg-red-50 hover:text-royal transition-colors"
                        title="Deactivate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Deactivate Product">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              This will mark <strong>{deleteTarget?.nameEn}</strong> as inactive.
              It will no longer appear in the customer catalog.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Deactivate</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

