import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const categories = [
  { value: 'road', label: 'Road / Pothole', icon: '🛣️' },
  { value: 'water', label: 'Water Supply', icon: '💧' },
  { value: 'drainage', label: 'Drainage / Sewage', icon: '🚰' },
  { value: 'electricity', label: 'Electricity / Power', icon: '⚡' },
  { value: 'garbage', label: 'Garbage / Waste', icon: '🗑️' },
  { value: 'streetlight', label: 'Street Light', icon: '💡' },
  { value: 'other', label: 'Other', icon: '📋' },
]

export default function Complaints() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', phone: '', ward: '', category: 'road', description: '', location: '' })
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [trackId, setTrackId] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [trackError, setTrackError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/complaints/submit', form)
      setComplaintId(res.data.id)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    }
    setSubmitting(false)
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    setTrackError('')
    setTrackResult(null)
    try {
      const res = await api.get(`/complaints/status/${trackId}`)
      setTrackResult(res.data)
    } catch {
      setTrackError('Complaint not found. Check your ID.')
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const inputClass = "w-full border border-gray-200/60 rounded-xl px-4 py-3 text-sm transition-all duration-300 focus:border-[#0C4A3E] focus:shadow-[0_0_0_3px_rgba(12,74,62,0.08)] outline-none"

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="File a Complaint" description="Report road, water, drainage, electricity issues to Annur Town Panchayat" keywords="Annur complaint, panchayat, road, water, drainage issue" />
        <div className="max-w-md w-full bg-white border border-gray-200/60 rounded-3xl p-8 text-center shadow-xl animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Complaint Submitted!</h2>
          <p className="mb-2" style={{ color: 'var(--c-text-muted)' }}>Your complaint has been registered.</p>
          <div className="bg-gray-50 rounded-xl p-4 my-4">
            <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>Your Complaint ID:</p>
            <p className="text-3xl font-extrabold" style={{ color: 'var(--c-primary)' }}>#{complaintId}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--c-text-muted)' }}>Save this ID to track your complaint status</p>
          </div>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', ward: '', category: 'road', description: '', location: '' }) }}
            className="px-6 py-3 text-white rounded-xl font-bold transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('complaints.title') || 'File a Complaint'} subtitle={t('complaints.subtitle') || 'Report issues to Annur Town Panchayat'} />

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaint Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl mb-4 animate-fade-in text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/60 p-6 space-y-4">
              <h3 className="text-lg font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Complaint Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Your Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Ward / Area</label>
                  <input value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="e.g. Ward 5, Bazaar Street" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }}>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Description *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} resize-none`} style={{ background: '#F8F7F4' }} placeholder="Describe the issue in detail..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>Location / Address</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} style={{ background: '#F8F7F4' }} placeholder="Exact location of the issue" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3.5 text-white rounded-xl font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* Track Complaint */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200/60 p-6">
              <h3 className="text-base font-extrabold mb-3" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Track Complaint</h3>
              <form onSubmit={handleTrack} className="space-y-3">
                <input type="number" placeholder="Enter Complaint ID" value={trackId} onChange={e => setTrackId(e.target.value)}
                  className={inputClass} style={{ background: '#F8F7F4' }} required />
                <button type="submit" className="w-full py-2.5 bg-gray-100 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors" style={{ color: 'var(--c-text)' }}>
                  Check Status
                </button>
              </form>
              {trackError && <p className="text-red-600 text-sm mt-3">{trackError}</p>}
              {trackResult && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: '#F8F7F4' }}>
                  <p className="text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>Complaint #{trackResult.id}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-bold ${statusColors[trackResult.status]}`}>
                    {trackResult.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {trackResult.admin_remarks && (
                    <p className="text-sm mt-2" style={{ color: 'var(--c-text-muted)' }}>Remarks: {trackResult.admin_remarks}</p>
                  )}
                  <p className="text-[11px] mt-2" style={{ color: '#C4C0B8' }}>
                    Filed: {new Date(trackResult.submitted_at).toLocaleDateString()}
                    {trackResult.resolved_at && ` • Resolved: ${new Date(trackResult.resolved_at).toLocaleDateString()}`}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/40 rounded-3xl p-6">
              <h3 className="font-extrabold text-amber-900 mb-2">Important Numbers</h3>
              <div className="space-y-2 text-sm">
                <a href="tel:0425-4299908" className="flex items-center gap-2 text-amber-800 hover:underline font-bold">
                  <span>🏛️</span> Town Panchayat: 0425-4299908
                </a>
                <a href="tel:1800-425-3993" className="flex items-center gap-2 text-amber-800 hover:underline font-bold">
                  <span>📞</span> CM Helpline: 1800-425-3993
                </a>
                <a href="tel:1912" className="flex items-center gap-2 text-amber-800 hover:underline font-bold">
                  <span>⚡</span> TNEB Complaint: 1912
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
