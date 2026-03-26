import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const catConfig = {
  festival: { icon: '🎉', bg: 'bg-orange-50', tag: 'bg-orange-100 text-orange-800' },
  meeting: { icon: '🏛️', bg: 'bg-blue-50', tag: 'bg-blue-100 text-blue-800' },
  election: { icon: '🗳️', bg: 'bg-red-50', tag: 'bg-red-100 text-red-800' },
  sports: { icon: '🏆', bg: 'bg-green-50', tag: 'bg-green-100 text-green-800' },
  cultural: { icon: '🎭', bg: 'bg-purple-50', tag: 'bg-purple-100 text-purple-800' },
  other: { icon: '📅', bg: 'bg-gray-50', tag: 'bg-gray-100 text-gray-800' },
}

export default function Events() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Events & Festivals" description="Upcoming events, temple festivals, elections and cultural programs in Annur" keywords="Annur events, festivals, temple, election, cultural program" />
        <div className="skeleton h-8 w-48" />
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('events.title') || 'Events & Festivals'} subtitle={t('events.subtitle') || 'Upcoming events in Annur'} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {['all', 'festival', 'election', 'meeting', 'cultural', 'sports', 'other'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
              {cat === 'all' ? 'All' : (catConfig[cat]?.icon || '') + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4 stagger-children">
          {filtered.map(event => {
            const cfg = catConfig[event.category] || catConfig.other
            const eventDate = event.event_date ? new Date(event.event_date) : null
            const isPast = eventDate && eventDate < new Date(new Date().setHours(0,0,0,0))
            return (
              <div key={event.id} className={`bg-white rounded-3xl border border-gray-200/60 p-6 card-hover relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Date badge */}
                  <div className={`shrink-0 w-16 h-16 ${cfg.bg} rounded-2xl flex flex-col items-center justify-center`}>
                    <span className="text-2xl">{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${cfg.tag} uppercase tracking-wider`}>{event.category}</span>
                      {isPast && <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-200 text-gray-600">Past</span>}
                      {eventDate && (
                        <span className="text-xs font-bold" style={{ color: 'var(--c-primary)' }}>
                          {eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          {event.event_time ? ` • ${event.event_time}` : ''}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>{l(event, 'title')}</h3>
                    {event.location_en && (
                      <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                        <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {l(event, 'location')}
                      </p>
                    )}
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(event, 'description')}</p>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
              <div className="text-4xl mb-3">📅</div>
              <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>No events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
