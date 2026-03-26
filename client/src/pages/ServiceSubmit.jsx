import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

export default function ServiceSubmit() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    category: '', name_en: '', name_ta: '', owner: '',
    description_en: '', description_ta: '', contact: '', address_en: '', address_ta: '', maps_url: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/categories').then(r => {
      setCategories(r.data)
      if (r.data.length > 0) setForm(f => ({ ...f, category: r.data[0].slug }))
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/service-submissions/submit', form)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Submit Your Business" description="List your business on Annur Community Portal for free" keywords="add business Annur, list service, submit business, free listing" />
        <div className="max-w-md w-full bg-white border border-gray-200/60 rounded-3xl p-8 text-center shadow-xl animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{t('services.submissionSuccess')}</h2>
          <p className="mb-6" style={{ color: 'var(--c-text-muted)' }}>{t('services.submissionReview')}</p>
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            {t('services.backToAll')}
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = "w-full border border-gray-200/60 rounded-xl px-4 py-3 text-sm transition-all duration-300 focus:border-[#0C4A3E] focus:shadow-[0_0_0_3px_rgba(12,74,62,0.08)]"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('services.submitService')} subtitle={t('services.submitDescription')} backTo="/services" backLabel={t('services.backToAll')} />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl mb-4 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.categoryLabel')} *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }}>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{lang === 'ta' && cat.name_ta ? cat.name_ta : cat.name_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.businessName')} *</label>
            <input type="text" required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.businessNameTa')}</label>
            <input type="text" value={form.name_ta} onChange={e => setForm({ ...form, name_ta: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.owner')}</label>
            <input type="text" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.descriptionLabel')} (English)</label>
            <textarea value={form.description_en} rows={3} onChange={e => setForm({ ...form, description_en: e.target.value })} className={`${inputClass} resize-none`} style={{ background: '#F8F7F4' }} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.descriptionLabel')} (Tamil)</label>
            <textarea value={form.description_ta} rows={3} onChange={e => setForm({ ...form, description_ta: e.target.value })} className={`${inputClass} resize-none`} style={{ background: '#F8F7F4' }} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.contact')}</label>
            <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.address')} (English)</label>
              <input type="text" value={form.address_en} onChange={e => setForm({ ...form, address_en: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.address')} (Tamil)</label>
              <input type="text" value={form.address_ta} onChange={e => setForm({ ...form, address_ta: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--c-text)' }}>{t('services.mapsUrl')}</label>
            <input type="url" value={form.maps_url} placeholder="https://maps.google.com/..." onChange={e => setForm({ ...form, maps_url: e.target.value })} className={inputClass} style={{ background: '#F8F7F4' }} />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 text-white rounded-xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#0C4A3E]/20"
            style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {t('common.loading')}
              </>
            ) : t('services.submitBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}
