import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import WhatsAppShare from '../components/WhatsAppShare.jsx'
import SEO from '../components/SEO.jsx'

export default function NewsFeed() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [articles, setArticles] = useState([])
  const [events, setEvents] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    Promise.all([
      api.get('/articles').then(r => setArticles(r.data)).catch(() => {}),
      api.get('/events').then(r => setEvents(r.data)).catch(() => {}),
      api.get('/jobs').then(r => setJobs(r.data.slice(0, 5))).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  // Merge into unified feed sorted by date
  const feed = []
  articles.forEach(a => feed.push({ ...a, _type: 'article', _date: new Date(a.created_at), _icon: '📰' }))
  events.forEach(e => feed.push({ ...e, _type: 'event', _date: new Date(e.event_date || e.created_at), _icon: '📅' }))
  jobs.forEach(j => feed.push({ ...j, _type: 'job', _date: new Date(j.created_at), _icon: '💼' }))
  feed.sort((a, b) => b._date - a._date)

  const filtered = tab === 'all' ? feed : feed.filter(f => f._type === tab)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <SEO title="News Feed" description="Latest updates from Annur - news, events and job alerts" keywords="Annur news feed, updates, alerts, latest" />
        <div className="skeleton h-8 w-48" />
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('newsfeed.title') || 'News Feed'} subtitle={t('newsfeed.subtitle') || 'Latest updates from Annur'} />

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all', label: 'All', icon: '🔥' },
            { key: 'article', label: 'News', icon: '📰' },
            { key: 'event', label: 'Events', icon: '📅' },
            { key: 'job', label: 'Jobs', icon: '💼' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
              style={tab === t.key ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-3 stagger-children">
          {filtered.map((item, i) => (
            <div key={`${item._type}-${item.id}`} className="bg-white rounded-3xl border border-gray-200/60 p-5 card-hover relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0" style={{ background: 'rgba(12,74,62,0.06)' }}>
                  {item._icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                      item._type === 'article' ? 'bg-blue-100 text-blue-800'
                      : item._type === 'event' ? 'bg-orange-100 text-orange-800'
                      : 'bg-purple-100 text-purple-800'
                    }`}>{item._type === 'article' ? (item.category || 'news') : item._type}</span>
                    <span className="text-[11px] font-bold" style={{ color: '#C4C0B8' }}>
                      {item._date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[15px] leading-snug" style={{ color: 'var(--c-text)' }}>
                    {l(item, 'title') || l(item, 'name') || ''}
                  </h3>
                  {item._type === 'job' && item.company && (
                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--c-primary-light)' }}>{item.company}</p>
                  )}
                  {item._type === 'event' && item.location_en && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--c-text-muted)' }}>
                      📍 {l(item, 'location')}
                    </p>
                  )}
                  <p className="text-sm mt-2 line-clamp-2 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>
                    {l(item, 'content') || l(item, 'description') || ''}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <WhatsAppShare text={`${l(item, 'title') || l(item, 'name') || ''}\n${l(item, 'content') || l(item, 'description') || ''}\n\n- Annur Community Portal`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
              <div className="text-4xl mb-3">📰</div>
              <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>No updates yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
