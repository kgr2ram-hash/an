import { useState, useEffect } from 'react'
import api from '../api.js'

function StarRating({ rating, onRate, size = 'text-xl', interactive = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${size} transition-transform ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(star)}
        >
          {star <= (hover || rating) ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ serviceId, serviceName }) {
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [total, setTotal] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ reviewer_name: '', rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!serviceId) return
    api.get(`/reviews/${serviceId}`).then(r => {
      setReviews(r.data.reviews)
      setAvgRating(r.data.avg_rating)
      setTotal(r.data.total)
    }).catch(() => {})
  }, [serviceId, submitted])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) return alert('Please select a rating')
    setSubmitting(true)
    try {
      await api.post('/reviews', { service_id: serviceId, ...form })
      setSubmitted(true)
      setShowForm(false)
      setForm({ reviewer_name: '', rating: 0, comment: '' })
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting review')
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Rating Summary */}
      <div className="flex items-center gap-3 mb-3">
        {avgRating && (
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold" style={{ color: 'var(--c-text)' }}>{avgRating}</span>
            <StarRating rating={Math.round(parseFloat(avgRating))} size="text-sm" />
            <span className="text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>({total})</span>
          </div>
        )}
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl transition-colors border"
          style={{ color: 'var(--c-primary)', borderColor: 'rgba(12,74,62,0.2)', background: 'rgba(12,74,62,0.04)' }}
        >
          {showForm ? 'Cancel' : '+ Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl mb-3 animate-fade-in space-y-3" style={{ background: '#F8F7F4' }}>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Your Name</label>
            <input required value={form.reviewer_name} onChange={e => setForm({ ...form, reviewer_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200/60 rounded-xl text-sm outline-none focus:border-[#0C4A3E]" style={{ background: 'white' }} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Rating</label>
            <StarRating rating={form.rating} onRate={r => setForm({ ...form, rating: r })} interactive size="text-2xl" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Comment (optional)</label>
            <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={2}
              className="w-full px-3 py-2 border border-gray-200/60 rounded-xl text-sm outline-none resize-none focus:border-[#0C4A3E]" style={{ background: 'white' }} />
          </div>
          <button type="submit" disabled={submitting}
            className="px-4 py-2 text-white rounded-xl text-sm font-bold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {submitted && !showForm && (
        <p className="text-xs font-bold text-emerald-600 mb-2 animate-fade-in">Thank you for your review!</p>
      )}

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.slice(0, 3).map(r => (
            <div key={r.id} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                {r.reviewer_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>{r.reviewer_name}</span>
                  <StarRating rating={r.rating} size="text-[10px]" />
                </div>
                {r.comment && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{r.comment}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
