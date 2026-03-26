import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_BASE = API_BASE.replace('/api', '')

const catLabels = {
  landmark: { icon: '🏛️', label: 'Landmarks' },
  festival: { icon: '🎉', label: 'Festivals' },
  nature: { icon: '🌿', label: 'Nature' },
  people: { icon: '👥', label: 'People' },
  event: { icon: '📅', label: 'Events' },
  other: { icon: '📷', label: 'Other' },
}

export default function Gallery() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    api.get('/gallery').then(r => setPhotos(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter)
  const categories = [...new Set(photos.map(p => p.category))]

  const getImgSrc = (url) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `${SERVER_BASE}${url}`
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
      <SEO title="Photo Gallery" description="Photos of Annur - landmarks, temples, festivals and community events" keywords="Annur photos, gallery, temple, landmark, festival" />
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title="Gallery" subtitle="Photos of Annur - Landmarks, Festivals & More" />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
            style={filter === 'all' ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
            All ({photos.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
              {catLabels[cat]?.icon} {catLabels[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {filtered.map(photo => (
            <div key={photo.id}
              className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer card-hover"
              onClick={() => setLightbox(photo)}>
              <img
                src={getImgSrc(photo.image_url)}
                alt={l(photo, 'title')}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-bold truncate">{l(photo, 'title')}</p>
                <span className="text-white/60 text-[10px] font-bold uppercase">{photo.category}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
            <div className="text-4xl mb-3">📷</div>
            <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>No photos yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl">&times;</button>
          <div className="max-w-4xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <img src={getImgSrc(lightbox.image_url)} alt={l(lightbox, 'title')} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <div className="mt-3 text-center">
              <p className="text-white text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>{l(lightbox, 'title')}</p>
              <span className="text-white/40 text-xs font-bold uppercase">{lightbox.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
