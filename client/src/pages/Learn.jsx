import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import VoiceSearch from '../components/VoiceSearch.jsx'
import SEO from '../components/SEO.jsx'

export default function Learn() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  useEffect(() => {
    api.get('/articles').then(r => setArticles(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="News & Articles" description="Latest news, educational articles and awareness content for Annur community" keywords="Annur news, articles, education, awareness, Tamil Nadu" />
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('learn.title')} subtitle={t('learn.subtitle')} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <VoiceSearch placeholder={t('common.search') || 'Search articles... 🎤'} value={search} onChange={setSearch} onResult={setSearch} />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['all', ...new Set(articles.map(a => a.category))].map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${catFilter === cat ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
                style={catFilter === cat ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
                {cat === 'all' ? t('services.all') : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {articles.filter(a => {
            const matchCat = catFilter === 'all' || a.category === catFilter
            const matchSearch = !search.trim() || [a.title_en, a.title_ta, a.content_en, a.content_ta, a.category].some(v => v && v.toLowerCase().includes(search.toLowerCase()))
            return matchCat && matchSearch
          }).map(article => (
            <div key={article.id} className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover group">
              {article.video_url ? (
                <div className="aspect-video bg-gray-100">
                  <iframe src={article.video_url} className="w-full h-full" allowFullScreen title={l(article, 'title')} />
                </div>
              ) : article.image_url ? (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-2" style={{ background: 'linear-gradient(135deg, #0C4A3E, #18A67A)' }} />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider" style={{ background: 'rgba(12,74,62,0.06)', color: 'var(--c-primary)' }}>
                    {article.category}
                  </span>
                  {article.is_featured ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      {t('learn.featured')}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-base font-extrabold mt-3 leading-snug" style={{ color: 'var(--c-text)' }}>{l(article, 'title')}</h3>
                <p className="text-sm mt-2 line-clamp-3 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(article, 'content')}</p>
                <p className="text-[11px] mt-4 font-bold" style={{ color: '#C4C0B8' }}>
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {articles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
