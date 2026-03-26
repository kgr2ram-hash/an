import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

export default function ServiceDetail() {
  const { category } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [services, setServices] = useState([])
  const [catInfo, setCatInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/services').then(r => setServices(r.data.filter(s => s.category === category))).catch(() => {}),
      api.get('/categories').then(r => setCatInfo(r.data.find(c => c.slug === category))).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [category])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const catName = catInfo ? (lang === 'ta' && catInfo.name_ta ? catInfo.name_ta : catInfo.name_en) : category

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Service Details" description="Browse local businesses and services in Annur" keywords="Annur business, local service, directory" />
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={catName} subtitle={t('services.categorySubtitle')} backTo="/services" backLabel={t('services.backToAll')} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {services.map(svc => (
            <div key={svc.id} className="bg-white rounded-3xl border border-gray-200/60 p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg" style={{ background: 'rgba(12,74,62,0.08)', color: 'var(--c-primary)' }}>
                  {l(svc, 'name').charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-snug" style={{ color: 'var(--c-text)' }}>{l(svc, 'name')}</h3>
                  {svc.owner && <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>{t('services.owner')}: {svc.owner}</p>}
                </div>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(svc, 'description')}</p>
              {svc.address_en && (
                <p className="text-sm mt-3 flex items-start gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {l(svc, 'address')}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {svc.contact && (
                  <a href={`tel:${svc.contact}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {svc.contact}
                  </a>
                )}
                {svc.maps_url && (
                  <>
                    <a href={svc.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      {t('services.viewOnMaps')}
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {services.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
            <div className="text-4xl mb-3">🏪</div>
            <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
