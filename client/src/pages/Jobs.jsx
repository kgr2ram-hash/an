import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import WhatsAppShare from '../components/WhatsAppShare.jsx'
import VoiceSearch from '../components/VoiceSearch.jsx'
import SEO from '../components/SEO.jsx'

export default function Jobs() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter(j => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [j.title_en, j.title_ta, j.company, j.description_en, j.description_ta, j.experience].some(v => v && v.toLowerCase().includes(q))
  })

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Jobs" description="Latest job vacancies and employment opportunities in Annur, Coimbatore" keywords="Annur jobs, Coimbatore jobs, textile jobs, IT jobs Annur" />
        <div className="skeleton h-8 w-48" />
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-3xl" />)}
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('jobs.title')} subtitle={t('jobs.subtitle')} />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Search with Voice */}
            <VoiceSearch placeholder={t('common.search') || 'Search jobs... 🎤'} value={search} onChange={setSearch} onResult={setSearch} />
            <div className="space-y-4 stagger-children">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-3xl border border-gray-200/60 p-6 card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04]" style={{ background: 'var(--c-primary)', transform: 'translate(30%, -30%)' }} />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-extrabold leading-snug" style={{ color: 'var(--c-text)' }}>{l(job, 'title')}</h3>
                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--c-primary-light)' }}>{job.company}</p>
                  </div>
                  {job.deadline && (
                    <span className="text-[11px] bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-xl font-bold self-start whitespace-nowrap">
                      {t('jobs.deadline')}: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {job.experience && (
                  <span className="inline-block text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg mt-2 font-bold">
                    {t('jobs.experience')}: {job.experience}
                  </span>
                )}
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(job, 'description')}</p>
                {job.contact && (
                  <p className="text-sm mt-3" style={{ color: 'var(--c-text-muted)' }}>
                    {t('jobs.contact')}: <a href={`tel:${job.contact}`} className="font-bold hover:underline" style={{ color: 'var(--c-primary)' }}>{job.contact}</a>
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
                  {job.know_more_url && (
                    <a href={job.know_more_url} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200" style={{ color: 'var(--c-text)' }}>
                      {t('jobs.knowMore')}
                    </a>
                  )}
                  {job.apply_url && (
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#0C4A3E]/20 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                      {t('jobs.apply')}
                    </a>
                  )}
                  <WhatsAppShare text={`${l(job, 'title')} at ${job.company}\n${l(job, 'description')}\n\nApply: ${job.apply_url || 'Contact directly'}`} />
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
                <div className="text-4xl mb-3">💼</div>
                <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{t('jobs.noJobs')}</p>
              </div>
            )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/40 rounded-3xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="font-extrabold text-blue-900">{t('jobs.buildResume')}</h3>
              </div>
              <p className="text-sm text-blue-700/60 mb-4">{t('jobs.resumeDescription')}</p>
              <a href="https://open-resume.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                {t('jobs.buildResume')}
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200/40 rounded-3xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                </div>
                <h3 className="font-extrabold text-purple-900">{t('jobs.learnCoding')}</h3>
              </div>
              <p className="text-sm text-purple-700/60 mb-4">{t('jobs.codingDescription')}</p>
              <div className="space-y-2">
                {[
                  { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
                  { name: 'W3Schools', url: 'https://www.w3schools.com' },
                  { name: 'Codecademy', url: 'https://www.codecademy.com' },
                ].map(site => (
                  <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 bg-white/60 rounded-xl text-sm font-bold text-purple-700 hover:bg-white transition-colors border border-purple-100/50">
                    {site.name}
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
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
