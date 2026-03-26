import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api.js'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useUser } from '../context/UserContext.jsx'

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function UserProfile() {
  const { user, token, isLoggedIn, logout, updateUser } = useUser()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    api.get('/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setProfile(r.data); setForm(r.data) })
      .catch(() => { logout(); navigate('/login') })
  }, [isLoggedIn])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/user/profile', form, { headers: { Authorization: `Bearer ${token}` } })
      setProfile(form)
      updateUser(form)
      setEditing(false)
      setMsg('Profile updated!')
      setTimeout(() => setMsg(''), 3000)
    } catch { setMsg('Error saving.') }
    setSaving(false)
  }

  if (!isLoggedIn || !profile) return null

  const inputClass = "w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm outline-none focus:border-[#0C4A3E]"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="My Profile" description="Your Annur Community Portal profile" />
      <PageHeader title="My Profile" subtitle="என் சுயவிவரம்" />

      <div className="max-w-lg mx-auto px-4 -mt-6 relative z-10 pb-12">
        {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-xl mb-4 animate-fade-in">{msg}</div>}

        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{profile.name}</h2>
              <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>📱 {profile.phone}</p>
              {profile.blood_group && <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-lg mt-1 inline-block">🩸 {profile.blood_group}</span>}
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Name</label>
                <input required value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Email</label>
                <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Area</label>
                  <input value={form.area || ''} onChange={e => setForm({...form, area: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Blood Group</label>
                  <select value={form.blood_group || ''} onChange={e => setForm({...form, blood_group: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { setEditing(false); setForm(profile) }} className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-bold" style={{ color: 'var(--c-text-muted)' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Phone', value: profile.phone, icon: '📱' },
                { label: 'Email', value: profile.email || '—', icon: '📧' },
                { label: 'Area', value: profile.area || '—', icon: '📍' },
                { label: 'Blood Group', value: profile.blood_group || '—', icon: '🩸' },
                { label: 'Member Since', value: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '—', icon: '📅' },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>{f.icon} {f.label}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{f.value}</span>
                </div>
              ))}
              <button onClick={() => setEditing(true)} className="w-full py-2.5 text-white rounded-xl text-sm font-bold mt-3" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-5 mt-4">
          <h3 className="text-sm font-extrabold mb-3" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>My Activities</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { path: '/complaints', icon: '📢', label: 'My Complaints' },
              { path: '/blood-donors', icon: '🩸', label: 'Blood Donors' },
              { path: '/services/submit', icon: '➕', label: 'Add Business' },
              { path: '/tools', icon: '🧮', label: 'Tools' },
            ].map(l => (
              <Link key={l.path} to={l.path} className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors" style={{ color: 'var(--c-text-muted)' }}>
                <span className="text-lg">{l.icon}</span>
                <span className="text-xs font-bold">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full mt-4 py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100">
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
