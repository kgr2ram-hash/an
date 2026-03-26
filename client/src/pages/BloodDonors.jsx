import { useState, useEffect } from 'react'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const groupColors = { 'O+': 'bg-red-100 text-red-800', 'O-': 'bg-red-50 text-red-700', 'A+': 'bg-blue-100 text-blue-800', 'A-': 'bg-blue-50 text-blue-700', 'B+': 'bg-green-100 text-green-800', 'B-': 'bg-green-50 text-green-700', 'AB+': 'bg-purple-100 text-purple-800', 'AB-': 'bg-purple-50 text-purple-700' }

export default function BloodDonors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showRegister, setShowRegister] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', blood_group: 'O+', age: '', area: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/blood-donors').then(r => setDonors(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [submitted])

  const filtered = filter === 'all' ? donors : donors.filter(d => d.blood_group === filter)

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/blood-donors/register', form)
      setSubmitted(true)
      setShowRegister(false)
      setForm({ name: '', phone: '', blood_group: 'O+', age: '', area: '' })
    } catch (err) {
      alert(err.response?.data?.error || 'Error registering')
    }
    setSubmitting(false)
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm outline-none focus:border-[#0C4A3E]"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Blood Donor Directory" description="Find blood donors in Annur by blood group. Register as a donor" keywords="blood donor Annur, blood bank, O+, A+, B+, donate blood" />
      <PageHeader title="Blood Donor Directory" subtitle="Find blood donors in Annur. Save a life!">
        <button onClick={() => setShowRegister(!showRegister)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
          {showRegister ? 'Cancel' : '🩸 Register as Donor'}
        </button>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Register Form */}
        {showRegister && (
          <form onSubmit={handleRegister} className="bg-white rounded-3xl border border-gray-200/60 p-6 mb-5 animate-fade-in space-y-4">
            <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Register as Blood Donor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Phone *</label>
                <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Blood Group *</label>
                <select value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }}>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Age</label>
                <input type="number" min="18" max="65" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Area / Location</label>
              <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="e.g. Near Bus Stand, Ward 5" />
            </div>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)' }}>
              {submitting ? 'Registering...' : '🩸 Register'}
            </button>
          </form>
        )}

        {submitted && <p className="text-sm font-bold text-emerald-600 mb-4 bg-emerald-50 p-3 rounded-xl animate-fade-in">Thank you for registering as a blood donor!</p>}

        {/* Blood Group Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'text-white shadow-md bg-red-600' : 'bg-white border border-gray-200/60'}`}
            style={filter !== 'all' ? { color: 'var(--c-text-muted)' } : {}}>
            All ({donors.length})
          </button>
          {BLOOD_GROUPS.map(g => {
            const count = donors.filter(d => d.blood_group === g).length
            return (
              <button key={g} onClick={() => setFilter(g)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === g ? 'text-white shadow-md bg-red-600' : 'bg-white border border-gray-200/60'}`}
                style={filter !== g ? { color: 'var(--c-text-muted)' } : {}}>
                {g} ({count})
              </button>
            )
          })}
        </div>

        {/* Donor List */}
        <div className="space-y-2 stagger-children">
          {filtered.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-200/60 p-4 flex items-center gap-4 card-hover">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold ${groupColors[d.blood_group] || 'bg-gray-100 text-gray-700'}`}>
                {d.blood_group}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm" style={{ color: 'var(--c-text)' }}>{d.name}</h3>
                {d.area && <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>{d.area}</p>}
              </div>
              <a href={`tel:${d.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
              <div className="text-4xl mb-3">🩸</div>
              <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{loading ? 'Loading...' : 'No donors found. Be the first to register!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
