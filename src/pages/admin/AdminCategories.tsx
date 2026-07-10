import { useEffect, useState, type FormEvent } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import type { Category } from '../../types'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories'
import { useToast } from '../../context/ToastContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'

interface CatForm { nameEn: string; nameHi: string; icon: string; slug: string }
const EMPTY: CatForm = { nameEn: '', nameHi: '', icon: '', slug: '' }

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function AdminCategories() {
  useDocumentTitle('Categories � Admin')
  const { success, error } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [form, setForm]             = useState<CatForm>(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting]     = useState(false)

  const load = () => getAllCategories().then((c) => { setCategories(c); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (cat: Category) => {
    setEditTarget(cat)
    setForm({ nameEn: cat.nameEn, nameHi: cat.nameHi, icon: cat.icon, slug: cat.slug })
    setModalOpen(true)
  }

  const set = (field: keyof CatForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
      ...(field === 'nameEn' && !editTarget ? { slug: slugify(e.target.value) } : {}),
    }))

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.nameEn.trim() || !form.slug.trim() || !form.icon.trim()) {
      error('Name, slug, and icon are required')
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        await updateCategory(editTarget.id, { nameEn: form.nameEn, nameHi: form.nameHi, icon: form.icon, slug: form.slug })
        success(`"${form.nameEn}" updated`)
      } else {
        await createCategory({ nameEn: form.nameEn, nameHi: form.nameHi, icon: form.icon, slug: form.slug, sortOrder: categories.length + 1, active: true })
        success(`"${form.nameEn}" created`)
      }
      setModalOpen(false)
      load()
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCategory(deleteTarget.id)
      success(`"${deleteTarget.nameEn}" deleted`)
      setDeleteTarget(null)
      load()
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Categories</h1>
          <p className="text-sm text-warm-gray">{categories.length} categories</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Category</Button>
      </div>

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-warm-gray">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 hidden sm:table-cell">Slug</th>
                <th className="px-5 py-3 hidden md:table-cell">Hindi</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium text-charcoal">{cat.nameEn}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-charcoal">{cat.slug}</code>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell font-hindi text-warm-gray">{cat.nameHi}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-gray hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-gray hover:bg-red-50 hover:text-royal transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <Input label="Icon" required value={form.icon} onChange={set('icon')} placeholder="🍬" className="col-span-1" />
            <div className="col-span-3">
              <Input label="Name (English)" required value={form.nameEn} onChange={set('nameEn')} />
            </div>
          </div>
          <Input label="Name (Hindi)" value={form.nameHi} onChange={set('nameHi')} placeholder="मिठाई" />
          <Input label="Slug" required value={form.slug} onChange={set('slug')} hint="URL-safe identifier, auto-generated" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} icon={<X className="h-4 w-4" />}>Cancel</Button>
            <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />}>{editTarget ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-warm-gray">
            Delete <strong>{deleteTarget?.nameEn}</strong>? This cannot be undone.
            Make sure no products are using this category.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

