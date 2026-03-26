import { useState, useEffect } from 'react'
import api from '../api.js'

const groupColors = {
  'O+': 'bg-red-100 text-red-800', 'O-': 'bg-red-50 text-red-700',
  'A+': 'bg-blue-100 text-blue-800', 'A-': 'bg-blue-50 text-blue-700',
  'B+': 'bg-green-100 text-green-800', 'B-': 'bg-green-50 text-green-700',
  'AB+': 'bg-purple-100 text-purple-800', 'AB-': 'bg-purple-50 text-purple-700',
}
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function ManageBloodDonors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', blood_group: 'O+', age: '', area: '' })
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('all')

  const fetchDonors = async () => {
    try {
      const res = await api.get('/blood-donors/all')
      setDonors(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchDonors() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/blood-donors/register', form)
      setShowForm(false)
      setForm({ name: '', phone: '', blood_group: 'O+', age: '', area: '' })
      fetchDonors()
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding donor.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this donor?')) return
    try {
      await api.delete(`/blood-donors/${id}`)
      fetchDonors()
    } catch {
      alert('Error deleting.')
    }
  }

  const filtered = donors.filter(d => {
    if (filterGroup !== 'all' && d.blood_group !== filterGroup) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [d.name, d.phone, d.area, d.blood_group].some(v => v && v.toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Blood Donors</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
          {showForm ? 'Cancel' : '+ Add Donor'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-100 p-5 mb-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input required placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input required placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <select value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input type="number" placeholder="Age" min="18" max="65" value={form.age} onChange={e => setForm({...form, age: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input placeholder="Area / Location" value={form.area} onChange={e => setForm({...form, area: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              Add Donor
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input type="text" placeholder="Search donors..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option value="all">All Blood Groups</option>
          {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <span className="text-sm text-gray-500 self-center">{filtered.length} donors</span>
      </div>

      {/* Table */}
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold">{d.id}</td>
                    <td className="py-3 px-4 font-medium">{d.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${groupColors[d.blood_group] || 'bg-gray-100'}`}>
                        {d.blood_group}
                      </span>
                    </td>
                    <td className="py-3 px-4"><a href={`tel:${d.phone}`} className="text-blue-600 hover:underline">{d.phone}</a></td>
                    <td className="py-3 px-4">{d.age || '—'}</td>
                    <td className="py-3 px-4 text-gray-500">{d.area || '—'}</td>
                    <td className="py-3 px-4 text-gray-500">{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(d.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-400">No donors found.</p>
          )}
        </div>
      )}
    </div>
  )
}
