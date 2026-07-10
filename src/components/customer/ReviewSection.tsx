import { useEffect, useState, type FormEvent } from 'react'
import type { Review } from '../../types'
import { getReviewsForProduct, addReview, hasReviewed, getAverageRating } from '../../services/reviews'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { StarRating } from './StarRating'
import { Button } from '../ui/Button'
import { Skeleton } from '../ui/Skeleton'

interface ReviewSectionProps { productId: string }

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { customer } = useAuth()
  const { success, error } = useToast()

  const [reviews, setReviews]   = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [rating, setRating]     = useState(5)
  const [comment, setComment]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [stats, setStats] = useState({ avg: 0, count: 0 })

  const load = async () => {
    const [r, s] = await Promise.all([
      getReviewsForProduct(productId),
      Promise.resolve(getAverageRating(productId)),
    ])
    setReviews(r)
    setStats(s)
    if (customer) setAlreadyReviewed(hasReviewed(productId, customer.id))
    setLoading(false)
  }
  useEffect(() => { load() }, [productId, customer])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!customer) return
    if (!comment.trim()) { error('Please write a comment'); return }
    setSubmitting(true)
    try {
      await addReview({
        productId,
        customerId: customer.id,
        customerName: customer.name,
        rating,
        comment: comment.trim(),
      })
      success('Review submitted! Thank you.')
      setComment('')
      setRating(5)
      load()
    } catch (e) {
      error(e instanceof Error ? e.message : 'Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-end gap-4">
        <h2 className="font-display text-2xl text-charcoal">Reviews</h2>
        {stats.count > 0 && (
          <div className="mb-0.5 flex items-center gap-2">
            <StarRating value={stats.avg} size="sm" />
            <span className="text-sm text-warm-gray">{stats.avg} / 5 · {stats.count} review{stats.count !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Write review */}
      {customer && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-sand-dark bg-sand/40 p-5">
          <h3 className="mb-3 font-semibold text-charcoal">Write a Review</h3>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-sm text-warm-gray">Your rating</span>
            <StarRating value={rating} interactive onChange={setRating} size="lg" />
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product…"
            className="mb-3 w-full rounded-lg border border-sand-dark bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <Button type="submit" size="sm" loading={submitting}>Submit Review</Button>
        </form>
      )}
      {!customer && (
        <p className="mb-6 rounded-xl border border-sand-dark bg-sand/40 p-4 text-sm text-warm-gray">
          <a href="/login" className="text-brand hover:underline">Sign in</a> to leave a review.
        </p>
      )}
      {customer && alreadyReviewed && (
        <p className="mb-6 rounded-xl border border-sand-dark bg-sand/40 p-4 text-sm text-warm-gray">
          ✓ You've already reviewed this product.
        </p>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-warm-gray">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {r.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{r.customerName}</p>
                    <p className="text-xs text-warm-gray">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <StarRating value={r.rating} size="sm" />
              </div>
              <p className="text-sm leading-relaxed text-warm-gray">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
