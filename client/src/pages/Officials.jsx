import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const emergencyIcons = {
  shield: '🛡️', ambulance: '🚑', fire: '🔥', building: '🏛️',
  zap: '⚡', child: '👶', women: '👩', elder: '👴', heart: '❤️', phone: '📞', bus: '🚌',
  'heart-pulse': '💓',
}

export default function Officials() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [officials, setOfficials] = useState([])
  const [emergencyNumbers, setEmergencyNumbers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/officials').then(r => setOfficials(r.data)).catch(() => {}),
      api.get('/emergency-numbers').then(r => setEmergencyNumbers(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Officials & Emergency Numbers" description="Local government officials, emergency contacts and helpline numbers for Annur" keywords="Annur officials, emergency numbers, police, hospital, fire" />
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('officials.title')} subtitle={t('officials.subtitle')} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {officials.map(off => (
            <div key={off.id} className="bg-white rounded-3xl border border-gray-200/60 p-5 flex items-start gap-4 card-hover">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0" style={{ background: 'rgba(12,74,62,0.08)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--c-primary)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>{l(off, 'name')}</h3>
                <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--c-primary-light)' }}>{l(off, 'designation')}</p>
                {off.party && <p className="text-[11px] mt-1" style={{ color: 'var(--c-text-muted)' }}>{off.party}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {off.contact && (
                    <a href={`tel:${off.contact}`} className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors font-bold border border-emerald-100">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {off.contact}
                    </a>
                  )}
                  {off.email && (
                    <a href={`mailto:${off.email}`} className="inline-flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors font-bold border border-blue-100">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {off.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {emergencyNumbers.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{t('officials.emergencyTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
              {emergencyNumbers.map(num => (
                <a key={num.id} href={`tel:${num.phone}`}
                  className="bg-white border border-red-100/60 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-red-50/50 hover:border-red-200 transition-all duration-300 group">
                  <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-red-100 transition-colors">
                    {emergencyIcons[num.icon] || '📞'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--c-text)' }}>{l(num, 'name')}</h3>
                    <p className="text-red-600 font-mono font-extrabold text-lg">{num.phone}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
