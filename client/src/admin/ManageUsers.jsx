import { useState, useEffect } from 'react'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const roleConfig = {
  super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800', desc: 'Full access. Manage users, delete, import/export.' },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-800', desc: 'Create & edit content. No delete or user management.' },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700', desc: 'View-only access. Analytics and dashboard.' },
}

export default function ManageUsers() {
  const { admin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', role: 'editor' })
  const [resetId, setResetId] = useState(null)
  const [resetPwd, setResetPwd] = useState('')
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try { const res = await api.get('/admin-users'); setUsers(res.data) } catch {} finally { setLoading(false) }
  }
  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/admin-users', form)
      setShowForm(false)
      setForm({ username: '', password: '', role: 'editor' })
      fetchUsers()
    } catch (err) { setError(err.response?.data?.error || 'Error creating user.') }
  }

  const handleRoleChange = async (id, role) => {
    try { await api.put(`/admin-users/${id}`, { role }); fetchUsers() }
    catch (err) { alert(err.response?.data?.error || 'Error updating role.') }
  }

  const handleResetPassword = async (id) => {
    if (!resetPwd || resetPwd.length < 4) return alert('Password must be at least 4 characters.')
    try { await api.put(`/admin-users/${id}/password`, { password: resetPwd }); setResetId(null); setResetPwd(''); alert('Password reset successfully.') }
    catch (err) { alert(err.response?.data?.error || 'Error resetting password.') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin user? This cannot be undone.')) return
    try { await api.delete(`/admin-users/${id}`); fetchUsers() }
    catch (err) { alert(err.response?.data?.error || 'Error deleting user.') }
  }

  if (admin?.role !== 'super_admin') {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-sm text-gray-400 mt-1">Only Super Admins can manage users.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Admin Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create, edit roles & manage admin accounts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
          {showForm ? 'Cancel' : '+ Add Admin'}
        </button>
      </div>

      {/* Role Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {Object.entries(roleConfig).map(([key, cfg]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-100 p-4">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${cfg.color} uppercase tracking-wider`}>{cfg.label}</span>
            <p className="text-xs text-gray-500 mt-2">{cfg.desc}</p>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-5 mb-5 space-y-3">
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Username *</label>
              <input required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. editor1" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Min 4 characters" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Role *</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="super_admin">Super Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">Create Admin</button>
        </form>
      )}

      {/* Users Table */}
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const cfg = roleConfig[u.role] || roleConfig.viewer
                  const isMe = u.id === admin.id
                  return (
                    <tr key={u.id} className={`border-t hover:bg-gray-50 ${isMe ? 'bg-green-50/30' : ''}`}>
                      <td className="py-3 px-4 font-bold">{u.id}</td>
                      <td className="py-3 px-4 font-medium">
                        {u.username} {isMe && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold ml-1">You</span>}
                      </td>
                      <td className="py-3 px-4">
                        {isMe ? (
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                        ) : (
                          <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold">
                            <option value="super_admin">Super Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {!isMe && (
                          <div className="flex gap-1">
                            {resetId === u.id ? (
                              <div className="flex gap-1">
                                <input type="password" placeholder="New password" value={resetPwd} onChange={e => setResetPwd(e.target.value)}
                                  className="px-2 py-1 border rounded text-xs w-28" />
                                <button onClick={() => handleResetPassword(u.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Save</button>
                                <button onClick={() => { setResetId(null); setResetPwd('') }} className="px-2 py-1 bg-gray-200 rounded text-xs">Cancel</button>
                              </div>
                            ) : (
                              <>
                                <button onClick={() => setResetId(u.id)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Reset Pwd</button>
                                <button onClick={() => handleDelete(u.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">Delete</button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
