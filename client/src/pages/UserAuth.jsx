import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useUser } from '../context/UserContext.jsx'

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function UserAuth() {
  const { login, isLoggedIn } = useUser()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', area: '', blood_group: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) { navigate('/profile'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        const res = await api.post('/user/login', { phone: form.phone, password: form.password })
        login(res.data.token, res.data.user)
        navigate('/profile')
      } else {
        const res = await api.post('/user/register', form)
        login(res.data.token, res.data.user)
        navigate('/profile')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    }
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200/60 rounded-xl text-sm font-medium outline-none focus:border-[#0C4A3E] focus:shadow-[0_0_0_3px_rgba(12,74,62,0.08)]"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title={tab === 'login' ? 'Login' : 'Register'} description="Login or register on Annur Community Portal" />
      <PageHeader title={tab === 'login' ? 'Login' : 'Create Account'} subtitle={tab === 'login' ? 'உள்நுழைக' : 'கணக்கு உருவாக்கு'} />

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-5 border border-gray-200/60">
          <button onClick={() => { setTab('login'); setError('') }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'login' ? 'text-white shadow' : ''}`}
            style={tab === 'login' ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
            🔑 Login
          </button>
          <button onClick={() => { setTab('register'); setError('') }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'register' ? 'text-white shadow' : ''}`}
            style={tab === 'register' ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
            ✨ Register
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl mb-4 text-sm animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Full Name / முழு பெயர் *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="e.g. Murugan K" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Mobile Number / மொபைல் எண் *</label>
            <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="e.g. 9876543210" maxLength={10} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Password / கடவுச்சொல் *</label>
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder={tab === 'login' ? 'Enter password' : 'Min 4 characters'} />
          </div>

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Email (optional)</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="your@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Area / பகுதி</label>
                  <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="e.g. Ward 5, Sathy Rd" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Blood Group</label>
                  <select value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 text-white rounded-xl font-bold disabled:opacity-50 transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
            {loading ? '...' : tab === 'login' ? '🔑 Login' : '✨ Create Account'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--c-text-muted)' }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
            className="font-bold underline" style={{ color: 'var(--c-primary)' }}>
            {tab === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
