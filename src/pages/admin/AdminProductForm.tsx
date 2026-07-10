import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ImageOff } from 'lucide-react'
import type { Category } from '../../types'
import { getProductById, createProduct, updateProduct } from '../../services/products'
import { getAllCategories } from '../../services/categories'
import { useToast } from '../../context/ToastContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

interface FormState {
  nameEn: string; nameHi: string; slug: string
  description: string; categoryId: string
  price: string; stock: string; imageUrl: string
  featured: boolean; active: boolean
}

const EMPTY: FormState = {
  nameEn: '', nameHi: '', slug: '', description: '',
  categoryId: '', price: '', stock: '', imageUrl: '',
  featured: false, active: true,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function AdminProductForm() {
  const { id } = useParams<{ id?: string }>()
  const isEdit  = Boolean(id)
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [form, setForm]       = useState<FormState>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors]   = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [imgPreview, setImgPreview] = useState('')

  useEffect(() => {
    getAllCategories().then(setCategories)
    if (!id) return
    getProductById(id).then((p) => {
      if (!p) { navigate('/admin/products'); return }
      setForm({
        nameEn: p.nameEn, nameHi: p.nameHi, slug: p.slug,
        description: p.description, categoryId: p.categoryId,
        price: String(p.price), stock: String(p.stock),
        imageUrl: p.imageUrl, featured: p.featured, active: p.active,
      })
      setImgPreview(p.imageUrl)
      setLoading(false)
    })
  }, [id, navigate])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((f) => ({
        ...f,
        [field]: val,
        ...(field === 'nameEn' && !isEdit ? { slug: slugify(e.target.value) } : {}),
      }))
    }

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.nameEn.trim()) e.nameEn = 'Required'
    if (!form.slug.trim()) e.slug = 'Required'
    if (!form.categoryId) e.categoryId = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Must be > 0'
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Must be ≥ 0'
    if (!form.imageUrl.trim()) e.imageUrl = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        nameEn: form.nameEn.trim(), nameHi: form.nameHi.trim(),
        slug: form.slug.trim(), description: form.description.trim(),
        categoryId: form.categoryId, price: Number(form.price),
        stock: Number(form.stock), imageUrl: form.imageUrl.trim(),
        featured: form.featured, active: form.active,
      }
      if (isEdit && id) {
        await updateProduct(id, data)
        success('Product updated successfully')
      } else {
        await createProduct(data)
        success('Product created successfully')
      }
      navigate('/admin/products')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-2xl space-y-4">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
    </div>
  )

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-warm-gray">
        <button onClick={() => navigate('/admin/products')} className="hover:text-brand">Products</button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-charcoal">{isEdit ? 'Edit Product' : 'Add Product'}</span>
      </nav>

      <h1 className="mb-6 font-display text-2xl text-charcoal">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        {/* Names */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name (English)" required value={form.nameEn} onChange={set('nameEn')} error={errors.nameEn} />
          <Input label="Name (Hindi)" value={form.nameHi} onChange={set('nameHi')} placeholder="हिन्दी नाम" />
        </div>

        {/* Slug */}
        <Input
          label="Slug (URL)"
          required
          value={form.slug}
          onChange={set('slug')}
          error={errors.slug}
          hint="Auto-generated from name. Use lowercase letters, numbers, hyphens."
        />

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-charcoal">Description <span className="text-royal">*</span></label>
          <textarea
            rows={3}
            value={form.description}
            onChange={set('description')}
            className="w-full rounded-lg border border-sand-dark px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Describe the product…"
          />
          {errors.description && <p className="text-xs text-royal">{errors.description}</p>}
        </div>

        {/* Category, Price, Stock */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Category"
            required
            value={form.categoryId}
            onChange={set('categoryId')}
            error={errors.categoryId}
            options={[{ value: '', label: 'Select…' }, ...categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.nameEn}` }))]}
          />
          <Input label="Price (₹)" required type="number" min="1" value={form.price} onChange={set('price')} error={errors.price} placeholder="e.g. 350" />
          <Input label="Stock (units)" required type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} placeholder="e.g. 50" />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <Input
            label="Image URL"
            required
            value={form.imageUrl}
            onChange={(e) => { set('imageUrl')(e); setImgPreview(e.target.value) }}
            error={errors.imageUrl}
            placeholder="https://images.unsplash.com/…"
          />
          {imgPreview && (
            <div className="h-32 w-32 overflow-hidden rounded-lg border border-sand-dark bg-sand">
              <img
                src={imgPreview}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).replaceWith(Object.assign(document.createElement('div'), { className: 'flex h-full items-center justify-center text-warm-gray', innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' })) }}
              />
            </div>
          )}
          {!imgPreview && (
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-sand-dark bg-sand text-warm-gray">
              <ImageOff className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-charcoal">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-brand" />
            Featured
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-charcoal">
            <input type="checkbox" checked={form.active} onChange={set('active')} className="h-4 w-4 accent-brand" />
            Active
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? 'Update Product' : 'Save Product'}</Button>
        </div>
      </form>
    </div>
  )
}
