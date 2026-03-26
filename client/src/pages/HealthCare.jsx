import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

export default function HealthCare() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [items, setItems] = useState([])
  const [facilities, setFacilities] = useState([])
  const [facilityFilter, setFacilityFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/health-care').then(r => setItems(r.data)).catch(() => {}),
      api.get('/healthcare-facilities').then(r => setFacilities(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const filteredFacilities = facilityFilter === 'all' ? facilities : facilities.filter(f => f.type === facilityFilter)
  const typeConfig = {
    insurance: { bg: 'bg-blue-50', icon: '🛡️', tag: 'bg-blue-100 text-blue-800' },
    program: { bg: 'bg-emerald-50', icon: '💚', tag: 'bg-emerald-100 text-emerald-800' },
    facility: { bg: 'bg-purple-50', icon: '🏥', tag: 'bg-purple-100 text-purple-800' },
  }
  const facilityTypeIcon = { hospital: '🏥', lab: '🔬', pharmacy: '💊' }
  const facilityTypeColor = {
    hospital: 'bg-red-50 text-red-700 border-red-200/60',
    lab: 'bg-blue-50 text-blue-700 border-blue-200/60',
    pharmacy: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Health Care" description="Health insurance schemes, government programs and healthcare facilities in Annur" keywords="Annur healthcare, hospital, CMCHIS, MTM, PHC, pharmacy" />
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('healthcare.title')} subtitle={t('healthcare.subtitle')} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {items.map(item => {
            const cfg = typeConfig[item.type] || typeConfig.program
            return (
              <div key={item.id} className="bg-white rounded-3xl border border-gray-200/60 p-6 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center text-lg`}>{cfg.icon}</div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${cfg.tag} uppercase tracking-wider`}>
                    {item.type === 'insurance' ? t('healthcare.insurance') : item.type === 'facility' ? 'Facility' : t('healthcare.program')}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold" style={{ color: 'var(--c-text)' }}>{l(item, 'title')}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(item, 'content')}</p>
                {item.maps_url && (
                  <a href={item.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-3 font-bold">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {t('services.viewOnMaps')}
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {facilities.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold mb-5" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{t('healthcare.facilitiesTitle')}</h2>
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
              {[
                { key: 'all', label: t('services.all'), icon: '🏷️' },
                { key: 'hospital', label: t('healthcare.hospitals'), icon: '🏥' },
                { key: 'lab', label: t('healthcare.labs'), icon: '🔬' },
                { key: 'pharmacy', label: t('healthcare.pharmacies'), icon: '💊' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFacilityFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    facilityFilter === tab.key
                      ? 'text-white shadow-md'
                      : 'bg-white border border-gray-200/60 hover:border-[#0C4A3E]/30'
                  }`}
                  style={facilityFilter === tab.key ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)', color: 'white' } : { color: 'var(--c-text-muted)' }}>
                  <span className="text-sm">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {filteredFacilities.map(f => (
                <div key={f.id} className="bg-white rounded-3xl border border-gray-200/60 p-5 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{facilityTypeIcon[f.type] || '🏥'}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${facilityTypeColor[f.type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {t(`healthcare.${f.type === 'hospital' ? 'hospitals' : f.type === 'lab' ? 'labs' : 'pharmacies'}`)}
                    </span>
                  </div>
                  <h3 className="font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>{l(f, 'name')}</h3>
                  {f.doctor_name && <p className="text-sm font-bold mt-1" style={{ color: 'var(--c-primary-light)' }}>{f.doctor_name}</p>}
                  {f.address_en && (
                    <p className="text-sm mt-1.5 flex items-start gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      {l(f, 'address')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    {f.contact && (
                      <a href={`tel:${f.contact}`} className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors font-bold border border-emerald-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {f.contact}
                      </a>
                    )}
                    {f.maps_url && (
                      <a href={f.maps_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors font-bold border border-blue-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {t('services.viewOnMaps')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
