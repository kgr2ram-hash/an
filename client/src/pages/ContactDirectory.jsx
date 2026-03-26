import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import VoiceSearch from '../components/VoiceSearch.jsx'
import SEO from '../components/SEO.jsx'

const catConfig = {
  government: { icon: '🏛️', label: 'Government' },
  hospital: { icon: '🏥', label: 'Hospital' },
  school: { icon: '🏫', label: 'School' },
  bank: { icon: '🏦', label: 'Bank' },
  police: { icon: '🛡️', label: 'Police' },
  transport: { icon: '🚌', label: 'Transport' },
  utility: { icon: '⚡', label: 'Utility' },
  business: { icon: '🏪', label: 'Business' },
  other: { icon: '📞', label: 'Other' },
}

export default function ContactDirectory() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/contacts').then(r => setContacts(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  const filtered = contacts.filter(c => {
    if (filter !== 'all' && c.category !== filter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [c.name_en, c.name_ta, c.phone, c.phone2, c.email, c.address_en].some(v => v && v.toLowerCase().includes(q))
  })

  const categories = [...new Set(contacts.map(c => c.category))]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Contact Directory" description="Phone book of Annur - government offices, hospitals, banks, schools contacts" keywords="Annur contacts, phone directory, government office, bank, school" />
        <div className="skeleton h-8 w-48" />
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20 rounded-3xl" />)}
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('directory.title') || 'Contact Directory'} subtitle={t('directory.subtitle') || 'Searchable phone book of Annur'} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Search with Voice */}
        <div className="mb-4">
          <VoiceSearch placeholder="Search name, phone, address... 🎤" value={search} onChange={setSearch} onResult={setSearch} />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
            style={filter === 'all' ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
            All ({contacts.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
              {catConfig[cat]?.icon} {catConfig[cat]?.label || cat}
            </button>
          ))}
        </div>

        <p className="text-sm mb-3 font-bold" style={{ color: '#C4C0B8' }}>{filtered.length} contacts found</p>

        {/* Contact List */}
        <div className="space-y-2 stagger-children">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200/60 p-4 flex items-center gap-4 card-hover group">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: 'rgba(12,74,62,0.06)' }}>
                {catConfig[c.category]?.icon || '📞'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm leading-snug truncate" style={{ color: 'var(--c-text)' }}>{l(c, 'name')}</h3>
                {c.address_en && <p className="text-[11px] truncate" style={{ color: 'var(--c-text-muted)' }}>{l(c, 'address')}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {c.phone}
                </a>
                {c.phone2 && (
                  <a href={`tel:${c.phone2}`} className="px-2 py-2 bg-gray-50 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100" style={{ color: 'var(--c-text-muted)' }}>
                    {c.phone2}
                  </a>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
              <div className="text-4xl mb-3">📞</div>
              <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>No contacts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
