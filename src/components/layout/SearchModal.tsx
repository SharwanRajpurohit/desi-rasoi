import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import type { Product } from '../../types'
import { getItem } from '../../services/storage'

function getProductsSync(): Product[] {
  return (getItem<Product[]>('products') ?? []).filter((p) => p.active)
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const inputRef  = useRef<HTMLInputElement>(null)
  const listRef   = useRef<HTMLDivElement>(null)

  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Product[]>([])
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); return }
    const products = getProductsSync()
    const found = products
      .filter((p) =>
        p.nameEn.toLowerCase().includes(q) ||
        p.nameHi.includes(q) ||
        p.description.toLowerCase().includes(q),
      )
      .slice(0, 8)
    setResults(found)
    setSelected(0)
  }, [query])

  const go = (product: Product) => {
    onClose()
    navigate(`/products/${product.slug}`)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && results[selected]) {
      go(results[selected])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-sand-dark px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-warm-gray" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-base text-charcoal placeholder:text-warm-gray focus:outline-none"
          />
          <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded text-warm-gray hover:text-charcoal">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-96 overflow-y-auto">
          {query && results.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-warm-gray">
              No products found for "<strong>{query}</strong>"
            </p>
          )}
          {results.map((product, i) => (
            <button
              key={product.id}
              onClick={() => go(product)}
              className={clsx(
                'flex w-full items-center gap-4 px-4 py-3 text-left transition-colors',
                i === selected ? 'bg-sand' : 'hover:bg-sand/50',
              )}
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sand-dark">
                <img src={product.imageUrl} alt={product.nameEn}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-charcoal line-clamp-1">{product.nameEn}</p>
                <p className="text-xs text-warm-gray">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-warm-gray" />
            </button>
          ))}
          {results.length > 0 && (
            <button
              onClick={() => { onClose(); navigate(`/products?q=${encodeURIComponent(query)}`) }}
              className="flex w-full items-center justify-center gap-2 border-t border-sand-dark py-3 text-sm font-medium text-brand hover:bg-sand/50 transition-colors"
            >
              <Search className="h-4 w-4" />
              See all results for "{query}"
            </button>
          )}
        </div>

        {!query && (
          <div className="px-5 py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-gray">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Sweets', 'Snacks', 'Pickles', 'Spices', 'Gift Hampers'].map((label) => (
                <button
                  key={label}
                  onClick={() => { onClose(); navigate(`/categories/${label.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`) }}
                  className="rounded-full border border-sand-dark bg-sand px-3 py-1 text-xs font-medium text-charcoal hover:bg-sand-dark transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-sand-dark bg-slate-50/50 px-4 py-2 text-[10px] text-warm-gray">
          <span><kbd className="rounded bg-slate-200 px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="rounded bg-slate-200 px-1 py-0.5 font-mono">↵</kbd> open</span>
          <span><kbd className="rounded bg-slate-200 px-1 py-0.5 font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
