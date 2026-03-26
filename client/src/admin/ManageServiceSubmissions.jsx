import { useState, useEffect } from 'react'
import api from '../api.js'

export default function ManageServiceSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/service-submissions/all')
      setSubmissions(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubmissions() }, [])

  const handleApprove = async (id) => {
    if (!confirm('Approve this submission and add to services?')) return
    try {
      await api.put(`/service-submissions/${id}/approve`)
      fetchSubmissions()
    } catch {
      alert('Error approving submission.')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Reject this submission?')) return
    try {
      await api.put(`/service-submissions/${id}/reject`)
      fetchSubmissions()
    } catch {
      alert('Error rejecting submission.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission permanently?')) return
    try {
      await api.delete(`/service-submissions/${id}`)
      fetchSubmissions()
    } catch {
      alert('Error deleting submission.')
    }
  }

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Submissions</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-400">No submissions yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Reviewed</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{sub.name_en}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{sub.category}</span>
                    </td>
                    <td className="py-3 px-4">{sub.owner || '—'}</td>
                    <td className="py-3 px-4">{sub.contact || '—'}</td>
                    <td className="py-3 px-4">{statusBadge(sub.status)}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {sub.reviewed_at ? new Date(sub.reviewed_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {sub.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(sub.id)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                              Approve
                            </button>
                            <button onClick={() => handleReject(sub.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(sub.id)}
                          className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
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
