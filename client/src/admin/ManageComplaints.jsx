import { useState, useEffect } from 'react'
import api from '../api.js'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [editRemarks, setEditRemarks] = useState('')

  const fetch_ = async () => {
    try { const res = await api.get('/complaints/all'); setComplaints(res.data) } catch {} finally { setLoading(false) }
  }
  useEffect(() => { fetch_() }, [])

  const handleUpdate = async (id) => {
    try {
      await api.put(`/complaints/${id}`, { status: editStatus, admin_remarks: editRemarks })
      setEditId(null)
      fetch_()
    } catch { alert('Error updating.') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return
    try { await api.delete(`/complaints/${id}`); fetch_() } catch { alert('Error deleting.') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Complaints</h1>
      {loading ? <p className="text-gray-400">Loading...</p> : complaints.length === 0 ? (
        <p className="text-gray-400">No complaints yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold">{c.id}</td>
                    <td className="py-3 px-4 font-medium">{c.name}</td>
                    <td className="py-3 px-4"><a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a></td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">{c.category}</span></td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-gray-500">{c.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(c.submitted_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {editId === c.id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full px-2 py-1 border rounded text-xs">
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <input value={editRemarks} onChange={e => setEditRemarks(e.target.value)} placeholder="Admin remarks" className="w-full px-2 py-1 border rounded text-xs" />
                          <div className="flex gap-1">
                            <button onClick={() => handleUpdate(c.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Save</button>
                            <button onClick={() => setEditId(null)} className="px-2 py-1 bg-gray-300 rounded text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => { setEditId(c.id); setEditStatus(c.status); setEditRemarks(c.admin_remarks || '') }}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Update</button>
                          <button onClick={() => handleDelete(c.id)}
                            className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">Delete</button>
                        </div>
                      )}
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
