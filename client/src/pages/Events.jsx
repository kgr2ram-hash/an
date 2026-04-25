import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const catConfig = {
  festival: { icon: '🎉', color: '#EA580C', bg: '#FFF7ED', tag: 'bg-orange-100 text-orange-700', border: '#FED7AA' },
  meeting:  { icon: '🏛️', color: '#2563EB', bg: '#EFF6FF', tag: 'bg-blue-100 text-blue-700',   border: '#BFDBFE' },
  election: { icon: '🗳️', color: '#DC2626', bg: '#FEF2F2', tag: 'bg-red-100 text-red-700',     border: '#FECACA' },
  sports:   { icon: '🏆', color: '#16A34A', bg: '#F0FDF4', tag: 'bg-green-100 text-green-700', border: '#BBF7D0' },
  cultural: { icon: '🎭', color: '#7C3AED', bg: '#F5F3FF', tag: 'bg-purple-100 text-purple-700',border: '#DDD6FE' },
  other:    { icon: '📅', color: '#6B7280', bg: '#F9FAFB', tag: 'bg-gray-100 text-gray-600',   border: '#E5E7EB' },
}

function daysUntil(dateStr) {
  const t = new Date(); t.setHours(0,0,0,0)
  const d = new Date(dateStr); d.setHours(0,0,0,0)
  return Math.floor((d - t) / 86400000)
}

export default function Events() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [cat, setCat] = useState('all')

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  const upcoming   = events.filter(e => e.event_date && daysUntil(e.event_date) >= 0)
  const past       = events.filter(e => e.event_date && daysUntil(e.event_date) < 0)
  const todayEvts  = events.filter(e => e.event_date && daysUntil(e.event_date) === 0)

  const base     = tab === 'upcoming' ? upcoming : tab === 'past' ? past : events
  const filtered = cat === 'all' ? base : base.filter(e => e.category === cat)

  if (loading) return (
    <div className="min-h-screen" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title="Events & Festivals" subtitle="Upcoming events in Annur" />
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Events & Festivals" description="Upcoming events, temple festivals, elections and cultural programs in Annur" keywords="Annur events, festivals, temple, election, cultural program" />
      <PageHeader title={t('events.title') || 'Events & Festivals'} subtitle={t('events.subtitle') || 'Upcoming events in Annur'} />

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-12">

        {/* Today's events banner */}
        {todayEvts.length > 0 && (
          <div className="mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <div className="px-4 py-3 flex items-start gap-3">
              <span className="text-2xl animate-bounce">🎯</span>
              <div>
                <p className="text-amber-900 font-extrabold text-sm">இன்றைய நிகழ்வுகள் / Today's Events</p>
                {todayEvts.map(e => (
                  <p key={e.id} className="text-amber-800 text-xs font-bold mt-0.5">• {l(e, 'title')}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Upcoming', count: upcoming.length,   color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
            { label: 'Total',    count: events.length,     color: 'var(--c-primary)', bg: 'white', border: '#E5E7EB' },
            { label: 'Past',     count: past.length,       color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-3 text-center"
              style={{ background: s.bg, borderColor: s.border }}>
              <p className="text-2xl font-extrabold leading-none" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming / All / Past tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 border border-gray-200/60" style={{ background: '#F3F2EF' }}>
          {[
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'all',      label: `All (${events.length})` },
            { key: 'past',     label: `Past (${past.length})` },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${tab === item.key ? 'bg-white shadow' : 'text-gray-400 hover:text-gray-600'}`}
              style={tab === item.key ? { color: 'var(--c-primary)' } : {}}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {['all','festival','election','meeting','cultural','sports','other'].map(c => {
            const cfg = catConfig[c]
            const active = cat === c
            return (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${active ? 'text-white shadow-md border-transparent' : 'bg-white border-gray-200/60'}`}
                style={active ? { background: c === 'all' ? 'linear-gradient(135deg,#0C4A3E,#14856A)' : cfg.color } : { color: 'var(--c-text-muted)' }}>
                {c === 'all' ? '📋 All Categories' : `${cfg.icon} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
              </button>
            )
          })}
        </div>

        {/* Event cards */}
        <div className="space-y-3 stagger-children">
          {filtered.map(event => {
            const cfg = catConfig[event.category] || catConfig.other
            const evDate = event.event_date ? new Date(event.event_date) : null
            const days   = event.event_date ? daysUntil(event.event_date) : null
            const isPast  = days !== null && days < 0
            const isToday = days === 0
            const isSoon  = days !== null && days > 0 && days <= 7

            return (
              <div key={event.id}
                className={`bg-white rounded-3xl overflow-hidden card-hover transition-all ${isPast ? 'opacity-55' : ''}`}
                style={{ border: `${isToday ? 2 : 1}px solid ${isToday ? cfg.color : cfg.border}` }}>
                <div className="flex items-stretch">

                  {/* Left: Date badge */}
                  {evDate ? (
                    <div className="shrink-0 w-20 flex flex-col items-center justify-center py-5 px-2 text-center border-r"
                      style={{ background: isPast ? '#F9FAFB' : cfg.bg, borderColor: isPast ? '#E5E7EB' : cfg.border }}>
                      <span className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: isPast ? '#9CA3AF' : cfg.color }}>
                        {evDate.toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span className="text-4xl font-extrabold leading-none my-0.5"
                        style={{ color: isPast ? '#9CA3AF' : cfg.color, fontFamily: 'var(--font-display)' }}>
                        {evDate.getDate()}
                      </span>
                      <span className="text-[9px] font-bold uppercase"
                        style={{ color: isPast ? '#9CA3AF' : cfg.color }}>
                        {evDate.toLocaleDateString('en-IN', { weekday: 'short' })}
                      </span>
                      <span className="text-xl mt-1.5">{cfg.icon}</span>
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 flex items-center justify-center" style={{ background: cfg.bg }}>
                      <span className="text-3xl">{cfg.icon}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${cfg.tag}`}>
                        {event.category}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-amber-900 animate-pulse">
                          🎯 TODAY!
                        </span>
                      )}
                      {isSoon && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-green-100 text-green-700">
                          {days === 1 ? 'Tomorrow!' : `${days} days away`}
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-400">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>
                      {l(event, 'title')}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                      {event.event_time && (
                        <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--c-text-muted)' }}>
                          🕐 {event.event_time}
                        </span>
                      )}
                      {event.location_en && (
                        <span className="text-xs font-bold flex items-center gap-1 truncate max-w-[220px]" style={{ color: 'var(--c-text-muted)' }}>
                          📍 {l(event, 'location')}
                        </span>
                      )}
                    </div>

                    {event.description_en && (
                      <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--c-text-muted)' }}>
                        {l(event, 'description')}
                      </p>
                    )}
                  </div>

                  {/* Right: countdown bubble (upcoming only) */}
                  {!isPast && days !== null && days > 0 && (
                    <div className="shrink-0 flex flex-col items-center justify-center pr-4 pl-2 gap-0.5">
                      <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-sm"
                        style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                        <span className="text-lg font-extrabold leading-none" style={{ color: cfg.color, fontFamily: 'var(--font-display)' }}>{days}</span>
                        <span className="text-[7px] font-bold uppercase tracking-wide" style={{ color: cfg.color }}>days</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
              <div className="text-5xl mb-3">{tab === 'past' ? '📜' : '🎉'}</div>
              <p className="font-extrabold text-base" style={{ color: 'var(--c-text)' }}>
                {tab === 'upcoming' ? 'No upcoming events' : tab === 'past' ? 'No past events' : 'No events found'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--c-text-muted)' }}>
                {tab === 'upcoming' ? 'Check back soon — new events will appear here!' : 'Try a different category filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
