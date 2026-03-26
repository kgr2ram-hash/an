import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api.js'
import PageHeader from '../components/PageHeader.jsx'
import ReviewSection from '../components/ReviewSection.jsx'
import QRShare from '../components/QRShare.jsx'
import VoiceSearch from '../components/VoiceSearch.jsx'
import SuggestEdit from '../components/SuggestEdit.jsx'
import SEO from '../components/SEO.jsx'

const serviceIcons = {
  medical: '🏥', tuition: '📚', repair: '🔧', ac_service: '❄️',
  courier: '📦', e_seva: '🖥️', stationery: '✏️', ticket: '🎫',
  photography: '📷', textile: '🧵', construction: '🏗️', other: '📋',
  saloon: '💇', tailor: '🧵', departmental_store: '🛒', jewellery: '💍',
  bakery: '🍰', hotels: '🍽️', theatre: '🎬', banks: '🏦',
  driving_school: '🚙', gym: '💪', marriage_hall: '💒', hardware: '🔨',
  lawyer: '⚖️', restaurants: '🍛', footwear: '👟',
  mobile_computer: '📱', petrol_gas: '⛽', agriculture: '🌾', flower_shop: '🌺',
  printing: '🖨️', real_estate: '🏠', electronics: '📺', temple: '🛕',
  school: '🏫', water_supply: '💧', catering: '🍱',
  it_software: '💻', auto_spare_parts: '🔩', car_wash: '🚿', veterinary_pet: '🐾',
  dairy_milk: '🥛', rice_grain: '🌾', furniture: '🪑', meat_shop: '🍗',
  welding: '🔥', opticals: '👓', cable_internet: '📡', laundry: '👔', tent_house: '⛺',
  insurance: '🛡️', cycle_ev: '🚲', travels: '🚕', sweets_snacks: '🍬',
  cement_sand: '🧱', astrology: '✨',
  painting: '🎨', pest_control: '🐛', cctv_security: '📹', solar_inverter: '☀️',
  plumber: '🪠', gift_fancy: '🎁', cleaning: '🧹', transport_loading: '🚛',
  daycare: '👶', old_age_home: '🧓',
  accountant: '🧮', ngo: '❤️', coaching: '🎓', ambulance: '🚑',
  mill_factory: '🏭', tea_coffee: '☕', xerox_typing: '📄', mattress: '🛏️',
  auto_showroom: '🏎️', warehouse: '🏢', utensils: '🍳', cooperative: '🤝',
  ration_shop: '🏪', atm: '🏧', aadhaar_eseva: '🪪', money_transfer: '💸',
  tasmac: '🍷', vegetable_fruit: '🥬', firewood: '🪵', tractor_farm: '🚜',
  marriage_bureau: '💑',
}

export default function Services() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catSearch, setCatSearch] = useState('')
  const activeCat = searchParams.get('cat') || null

  useEffect(() => {
    Promise.all([
      api.get('/services').then(r => setServices(r.data)).catch(() => {}),
      api.get('/categories').then(r => setCategories(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const catName = (slug) => {
    const cat = categories.find(c => c.slug === slug)
    if (!cat) return slug
    return lang === 'ta' && cat.name_ta ? cat.name_ta : cat.name_en
  }
  const filtered = activeCat ? services.filter(s => {
    if (s.category !== activeCat) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [s.name_en, s.name_ta, s.owner, s.description_en, s.contact, s.address_en].some(v => v && v.toLowerCase().includes(q))
  }) : []
  const serviceCount = (slug) => services.filter(s => s.category === slug).length

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Services Directory" description="Find local services in Annur - medical, repair, textile, photography and 50+ categories" keywords="Annur services, local business, directory, shops, stores" />
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader
        title={activeCat ? catName(activeCat) : t('services.title')}
        subtitle={activeCat ? `${filtered.length} services found` : `${categories.length} categories available`}
      >
        <div className="flex items-center gap-2">
          {activeCat && (
            <button onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              All
            </button>
          )}
          <Link to="/services/submit"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
            {t('services.addYourService')}
          </Link>
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <Link to="/services/submit"
          className="sm:hidden flex items-center justify-center gap-2 w-full mb-4 px-4 py-3.5 bg-white rounded-2xl text-sm font-bold border border-gray-200/60 shadow-sm card-hover" style={{ color: 'var(--c-primary)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
          {t('services.addYourService')}
        </Link>

        {!activeCat && (
          <div>
            {/* Category Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input type="text" placeholder="Search categories..." value={catSearch} onChange={e => setCatSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200/60 rounded-2xl text-sm font-medium focus:border-[#0C4A3E] focus:shadow-[0_0_0_3px_rgba(12,74,62,0.08)] outline-none" />
              {catSearch && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>
                {categories.filter(c => !catSearch.trim() || [c.name_en, c.name_ta, c.slug].some(v => v && v.toLowerCase().includes(catSearch.toLowerCase()))).length} found
              </span>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 stagger-children">
              {categories.filter(c => {
                if (!catSearch.trim()) return true
                const q = catSearch.toLowerCase()
                return [c.name_en, c.name_ta, c.slug].some(v => v && v.toLowerCase().includes(q))
              }).map(cat => (
                <button key={cat.id} onClick={() => setSearchParams({ cat: cat.slug })}
                  className="bg-white rounded-2xl border border-gray-200/60 p-3 flex flex-col items-center gap-2 card-hover group text-center">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-all duration-300" style={{ background: '#F8F7F4' }}>
                    {serviceIcons[cat.slug] || '📋'}
                  </div>
                  <div>
                    <h3 className="font-bold text-[11px] leading-snug" style={{ color: 'var(--c-text)' }}>{l(cat, 'name')}</h3>
                    <p className="text-[9px] font-bold" style={{ color: '#C4C0B8' }}>{serviceCount(cat.slug)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeCat && (
          <>
            <div className="mb-4">
              <VoiceSearch placeholder={t('common.search') || 'Search services... 🎤'} value={search} onChange={setSearch} onResult={setSearch} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {filtered.map(svc => (
                <div key={svc.id} className="bg-white rounded-3xl border border-gray-200/60 p-5 card-hover group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-lg transition-colors" style={{ background: 'rgba(12,74,62,0.08)', color: 'var(--c-primary)' }}>
                      {l(svc, 'name').charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold leading-snug truncate" style={{ color: 'var(--c-text)' }}>{l(svc, 'name')}</h3>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--c-primary-light)' }}>{catName(svc.category)}</span>
                    </div>
                  </div>
                  {svc.owner && <p className="text-[11px] mb-1" style={{ color: 'var(--c-text-muted)' }}>{t('services.owner')}: {svc.owner}</p>}
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(svc, 'description')}</p>
                  {svc.contact && (
                    <a href={`tel:${svc.contact}`} className="text-sm text-emerald-600 mt-3 inline-flex items-center gap-1.5 font-bold hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {svc.contact}
                    </a>
                  )}
                  {svc.address_en && (
                    <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      <span className="truncate">{l(svc, 'address')}</span>
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <QRShare text={`${svc.name_en} - ${svc.contact || ''} - ${svc.address_en || ''} | Annur Community Portal`} />
                    <SuggestEdit serviceName={svc.name_en} serviceId={svc.id} />
                  </div>
                  <ReviewSection serviceId={svc.id} serviceName={svc.name_en} />
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/60">
                <div className="text-4xl mb-3">🏪</div>
                <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{t('common.noData')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
