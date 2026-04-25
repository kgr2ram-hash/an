import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import WhatsAppShare from '../components/WhatsAppShare.jsx'
import VoiceSearch from '../components/VoiceSearch.jsx'
import SEO from '../components/SEO.jsx'

const JOB_TYPES = [
  { key: 'all',        label: 'All Jobs',    icon: '💼', color: '#0C4A3E' },
  { key: 'govt',       label: 'Government',  icon: '🏛️', color: '#1D4ED8' },
  { key: 'local',      label: 'Local Annur', icon: '📍', color: '#D97706' },
  { key: 'it',         label: 'IT / Tech',   icon: '💻', color: '#7C3AED' },
  { key: 'medical',    label: 'Medical',     icon: '🏥', color: '#DC2626' },
  { key: 'textile',    label: 'Textile',     icon: '🧵', color: '#0891B2' },
]

const GOVT_KEYWORDS = ['tnpsc', 'trb', 'tangedco', 'tneb', 'government', 'collector', 'nhm', 'ration', 'psc', 'railway', 'bank', 'wcd', 'anganwadi', 'ntep', 'district', 'taluk', 'public service', 'cooperative']
const IT_KEYWORDS   = ['software', 'developer', 'react', 'node', 'python', 'java', 'it ', '.net', 'cognizant', 'zoho', 'freshworks', 'tech', 'coding', 'programmer', 'engineer']
const MED_KEYWORDS  = ['nurse', 'doctor', 'lab technician', 'pharmacist', 'hospital', 'medical', 'health', 'clinic', 'dmlt', 'bmlt', 'gnm', 'nursing']
const TEX_KEYWORDS  = ['textile', 'spinning', 'garment', 'cotton', 'fabric', 'weaving', 'mill', 'knit', 'ginning', 'terry', 'tiruppur']
const LOCAL_ANNUR   = ['annur', 'smf', 'nm hospital', 'vasanthi', 'sharadha', 'senthur']

function classify(job) {
  const haystack = `${job.title_en} ${job.company} ${job.description_en}`.toLowerCase()
  if (GOVT_KEYWORDS.some(k => haystack.includes(k))) return 'govt'
  if (IT_KEYWORDS.some(k => haystack.includes(k)))   return 'it'
  if (MED_KEYWORDS.some(k => haystack.includes(k)))  return 'medical'
  if (TEX_KEYWORDS.some(k => haystack.includes(k)))  return 'textile'
  if (LOCAL_ANNUR.some(k => haystack.includes(k)))   return 'local'
  return 'local'
}

function daysLeft(deadline) {
  if (!deadline) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(deadline); d.setHours(0,0,0,0)
  return Math.floor((d - today) / 86400000)
}

export default function Jobs() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase()
    const matchSearch = !q || [j.title_en, j.title_ta, j.company, j.description_en, j.experience].some(v => v && v.toLowerCase().includes(q))
    const matchType = typeFilter === 'all' || classify(j) === typeFilter
    return matchSearch && matchType
  })

  // Stats
  const govtCount    = jobs.filter(j => classify(j) === 'govt').length
  const localCount   = jobs.filter(j => classify(j) === 'local').length
  const urgentCount  = jobs.filter(j => { const d = daysLeft(j.deadline); return d !== null && d <= 7 && d >= 0 }).length

  if (loading) return (
    <div className="min-h-screen" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('jobs.title')} subtitle={t('jobs.subtitle')} />
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-36 rounded-3xl" />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Jobs in Annur" description="Latest job vacancies and employment opportunities in Annur, Coimbatore — government, textile, IT, healthcare and local jobs" keywords="Annur jobs, Coimbatore jobs, textile jobs, IT jobs, government jobs, TNPSC, TRB, Annur vacancy" />
      <PageHeader title={t('jobs.title')} subtitle="Latest vacancies in Annur & Coimbatore area" />

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 pb-12">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total Jobs',    value: jobs.length,    color: 'var(--c-primary)', bg: 'white',    border: '#E5E7EB' },
            { label: 'Govt / PSU',   value: govtCount,      color: '#1D4ED8',           bg: '#EFF6FF',  border: '#BFDBFE' },
            { label: 'Local Annur',  value: localCount,     color: '#D97706',           bg: '#FFFBEB',  border: '#FDE68A' },
            { label: '⚡ Urgent',    value: urgentCount,    color: '#DC2626',           bg: '#FEF2F2',  border: '#FECACA' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-2.5 text-center" style={{ background: s.bg, borderColor: s.border }}>
              <p className="text-xl font-extrabold leading-none" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-3">
          <VoiceSearch placeholder="Search jobs, companies, skills... 🎤" value={search} onChange={setSearch} onResult={setSearch} />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {JOB_TYPES.map(jt => (
            <button key={jt.key} onClick={() => setTypeFilter(jt.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${typeFilter === jt.key ? 'text-white shadow-md border-transparent' : 'bg-white border-gray-200/60'}`}
              style={typeFilter === jt.key ? { background: jt.color } : { color: 'var(--c-text-muted)' }}>
              {jt.icon} {jt.label}
              {jt.key !== 'all' && (
                <span className="ml-1.5 opacity-60">({jobs.filter(j => classify(j) === jt.key).length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Job cards */}
          <div className="lg:col-span-2 space-y-3 stagger-children">
            {filtered.map(job => {
              const days     = daysLeft(job.deadline)
              const isUrgent = days !== null && days <= 7 && days >= 0
              const isNew    = job.created_at && (Date.now() - new Date(job.created_at)) < 7 * 86400000
              const type     = classify(job)
              const typeCfg  = JOB_TYPES.find(t => t.key === type) || JOB_TYPES[0]

              return (
                <div key={job.id} className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover">
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ background: typeCfg.color }} />

                  <div className="p-5">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg text-white" style={{ background: typeCfg.color }}>
                        {typeCfg.icon} {typeCfg.label}
                      </span>
                      {isNew && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-green-500 text-white animate-pulse">
                          ✨ NEW
                        </span>
                      )}
                      {isUrgent && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-red-500 text-white animate-pulse">
                          ⚡ URGENT
                        </span>
                      )}
                      {job.experience && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                          🎓 {job.experience}
                        </span>
                      )}
                    </div>

                    {/* Title + Company */}
                    <h3 className="text-base font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>
                      {l(job, 'title')}
                    </h3>
                    <p className="text-sm font-bold mt-0.5" style={{ color: typeCfg.color }}>
                      🏢 {job.company}
                    </p>

                    {/* Description */}
                    <p className="text-xs mt-2.5 leading-relaxed line-clamp-2" style={{ color: 'var(--c-text-muted)' }}>
                      {l(job, 'description')}
                    </p>

                    {/* Deadline + contact row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {job.deadline && days !== null && (
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isUrgent ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-gray-400'}`}>
                          📅 {days === 0 ? 'Closes TODAY!' : days < 0 ? 'Expired' : `${days} days left`}
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-400">{new Date(job.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                        </span>
                      )}
                      {job.contact && (
                        <a href={`tel:${job.contact}`} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                          📞 {job.contact}
                        </a>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-gray-100">
                      {job.know_more_url && (
                        <a href={job.know_more_url} target="_blank" rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-gray-50 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-200" style={{ color: 'var(--c-text)' }}>
                          Know More →
                        </a>
                      )}
                      {job.apply_url && (
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${typeCfg.color}, ${typeCfg.color}CC)` }}>
                          Apply Now →
                        </a>
                      )}
                      <WhatsAppShare text={`💼 Job: ${l(job, 'title')}\n🏢 ${job.company}\n${l(job, 'description')}\n\n${job.apply_url ? 'Apply: ' + job.apply_url : job.contact ? 'Contact: ' + job.contact : ''}`} />
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
                <div className="text-5xl mb-3">💼</div>
                <p className="font-extrabold text-base" style={{ color: 'var(--c-text)' }}>
                  {search ? `No jobs matching "${search}"` : 'No jobs in this category'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--c-text-muted)' }}>
                  Try a different search or category.
                </p>
                {search && (
                  <button onClick={() => setSearch('')} className="mt-3 text-sm font-bold px-4 py-2 rounded-xl" style={{ background: 'rgba(12,74,62,0.08)', color: 'var(--c-primary)' }}>
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Post a job tip */}
            <div className="rounded-2xl p-4 border border-amber-200" style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' }}>
              <p className="font-extrabold text-sm text-amber-800 mb-1">📢 Have a Job Opening?</p>
              <p className="text-xs text-amber-700/80 mb-3">Post job vacancies for free on the Annur Community Portal. Reach thousands of local candidates.</p>
              <p className="text-[10px] font-bold text-amber-600">Contact admin to post: admin@annur.in</p>
            </div>

            {/* Build Resume */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="font-extrabold text-sm text-blue-900">{t('jobs.buildResume')}</h3>
              </div>
              <p className="text-xs text-blue-700/60 mb-3">{t('jobs.resumeDescription')}</p>
              <a href="https://open-resume.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                Build Free Resume →
              </a>
            </div>

            {/* Learn Coding */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                </div>
                <h3 className="font-extrabold text-sm text-purple-900">{t('jobs.learnCoding')}</h3>
              </div>
              <p className="text-xs text-purple-700/60 mb-3">{t('jobs.codingDescription')}</p>
              <div className="space-y-1.5">
                {[
                  { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
                  { name: 'W3Schools', url: 'https://www.w3schools.com' },
                  { name: 'Codecademy', url: 'https://www.codecademy.com' },
                ].map(site => (
                  <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-white/60 rounded-xl text-xs font-bold text-purple-700 hover:bg-white transition-colors border border-purple-100/50">
                    {site.name}
                    <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Useful links */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
              <h3 className="font-extrabold text-sm mb-3" style={{ color: 'var(--c-text)' }}>🔗 Job Portals</h3>
              <div className="space-y-1.5">
                {[
                  { name: 'TNPSC', url: 'https://www.tnpsc.gov.in' },
                  { name: 'TRB Tamil Nadu', url: 'https://trb.tn.gov.in' },
                  { name: 'Naukri.com', url: 'https://www.naukri.com' },
                  { name: 'Indeed India', url: 'https://in.indeed.com' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs' },
                ].map(site => (
                  <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors" style={{ color: 'var(--c-text-muted)' }}>
                    {site.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
