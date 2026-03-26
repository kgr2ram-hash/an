import { useState, useEffect } from 'react'
import api from '../api.js'

export default function ManageReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/admin/all')
      setReviews(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const toggleApproval = async (id, current) => {
    try {
      await api.put(`/reviews/${id}`, { is_approved: !current })
      fetchReviews()
    } catch { alert('Error updating.') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/reviews/${id}`)
      fetchReviews()
    } catch { alert('Error deleting.') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Reviews</h1>

      {loading ? <p className="text-gray-400">Loading...</p> : reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{r.service_name || `#${r.service_id}`}</td>
                    <td className="py-3 px-4">{r.reviewer_name}</td>
                    <td className="py-3 px-4">
                      <span className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-[200px] truncate">{r.comment || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.is_approved ? 'Approved' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => toggleApproval(r.id, r.is_approved)}
                          className={`px-2 py-1 rounded text-xs font-medium ${r.is_approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {r.is_approved ? 'Hide' : 'Approve'}
                        </button>
                        <button onClick={() => handleDelete(r.id)}
                          className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
