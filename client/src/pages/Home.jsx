import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import SEO from '../components/SEO.jsx'
import WeatherWidget, { WeatherCard } from '../components/WeatherWidget.jsx'
import GoldWidget from '../components/GoldWidget.jsx'
import QuickTools from '../components/QuickTools.jsx'

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

const articleAccents = [
  { gradient: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-300/40', tag: 'bg-amber-100 text-amber-800', icon: '📰' },
  { gradient: 'from-teal-500/10 to-emerald-500/10', border: 'border-teal-300/40', tag: 'bg-teal-100 text-teal-800', icon: '🌿' },
  { gradient: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-300/40', tag: 'bg-violet-100 text-violet-800', icon: '💡' },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Section({ children, className = '', delay = 0 }) {
  const [ref, visible] = useInView()
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  )
}

function SkeletonCard({ className = '' }) {
  return <div className={`skeleton h-32 rounded-2xl ${className}`} />
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [buses, setBuses] = useState([])
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [jobs, setJobs] = useState([])
  const [articles, setArticles] = useState([])
  const [healthCare, setHealthCare] = useState([])
  const [loading, setLoading] = useState(true)
  const [homeTab, setHomeTab] = useState('services')
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    Promise.all([
      api.get('/bus-schedules').then(r => {
        const now = new Date()
        const ct = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
        const upcoming = r.data.filter(bus => (bus.departure_time?.slice(0, 5) || '') >= ct)
        setBuses(upcoming.length > 0 ? upcoming.slice(0, 7) : r.data.slice(0, 7))
      }).catch(() => {}),
      api.get('/categories').then(r => setCategories(r.data)).catch(() => {}),
      api.get('/services').then(r => setServices(r.data)).catch(() => {}),
      api.get('/jobs').then(r => setJobs(r.data.slice(0, 4))).catch(() => {}),
      api.get('/articles').then(r => {
        const featured = r.data.filter(a => a.is_featured)
        setArticles(featured.length > 0 ? featured.slice(0, 3) : r.data.slice(0, 3))
      }).catch(() => {}),
      api.get('/health-care').then(r => setHealthCare(r.data.slice(0, 3))).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  // Populate gold price in hero + auto-refresh every 30 min
  useEffect(() => {
    function updateHeroGold() {
      sessionStorage.removeItem('gold_silver_v6')
      import('../utils/goldPrice.js').then(({ fetchGoldSilverPrices }) => {
        fetchGoldSilverPrices().then(p => {
          const gEl = document.getElementById('hero-gold-price')
          const sEl = document.getElementById('hero-silver-price')
          if (gEl) gEl.textContent = '₹' + p.gold.inr_gram_22k.toLocaleString('en-IN')
          if (sEl) sEl.textContent = '₹' + p.silver.inr_gram
        })
      })
    }
    updateHeroGold()
    const timer = setInterval(updateHeroGold, 30 * 60 * 1000)
    return () => clearInterval(timer)
  }, [loading])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const displayCategories = categories.slice(0, 16)

  if (loading) {
    return (
      <div className="min-h-screen px-4 pt-6 max-w-6xl mx-auto space-y-6" style={{ background: 'var(--c-surface)' }}>
        <SkeletonCard className="h-48" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton w-20 h-24 rounded-2xl flex-shrink-0" />)}
        </div>
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO description="Annur Community Portal - Bus schedules, local services, jobs, healthcare, events and more for Annur, Tamil Nadu" keywords="Annur, Coimbatore, community portal, bus schedule, services, jobs, healthcare, Tamil Nadu" />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden wave-divider" style={{ background: 'linear-gradient(135deg, #0C4A3E 0%, #0E6B52 40%, #18A67A 100%)' }}>
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="mesh-blob w-[500px] h-[500px] bg-[#F59E0B]/20 top-[-100px] right-[-100px]" />
          <div className="mesh-blob w-[400px] h-[400px] bg-[#14856A]/30 bottom-[-80px] left-[-60px]" />
          <div className="mesh-blob w-[300px] h-[300px] bg-[#FBBF24]/15 top-[40%] left-[30%]" />
        </div>
        <div className="absolute inset-0 noise-overlay" />

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Left: Text */}
            <div className="lg:col-span-3 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/10">
                <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse-dot" />
                <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">Annur Community Portal</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('home.welcome')}
              </h1>
              <p className="text-white/60 mt-3 text-sm md:text-base max-w-lg leading-relaxed">
                {t('home.subtitle')}
              </p>

              {/* Stat chips */}
              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  { label: 'Services', count: services.length, emoji: '🏪' },
                  { label: 'Bus Routes', count: buses.length + '+', emoji: '🚌' },
                  { label: 'Jobs', count: jobs.length, emoji: '💼' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3.5 py-2">
                    <span className="text-base">{s.emoji}</span>
                    <div>
                      <span className="text-white font-extrabold text-sm">{s.count}</span>
                      <span className="text-white/50 text-xs ml-1">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Widgets */}
            <div className="lg:col-span-2 space-y-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* Weather Mini */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <WeatherWidget />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <span className="text-white/40 text-[10px] font-bold">Annur Weather</span>
                  <span className="text-white/30 text-[10px]">{new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                </div>
              </div>

              {/* Gold Mini */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Live Gold & Silver</span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>🥇</span>
                      <span className="text-white font-extrabold text-base" style={{ fontFamily: 'var(--font-display)' }} id="hero-gold-price">—</span>
                    </div>
                    <p className="text-white/40 text-[9px] ml-6">per gram 22K</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>🥈</span>
                      <span className="text-white font-extrabold text-base" style={{ fontFamily: 'var(--font-display)' }} id="hero-silver-price">—</span>
                    </div>
                    <p className="text-white/40 text-[9px] ml-6">per gram</p>
                  </div>
                </div>
              </div>

              {/* Quick Links Mini */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3">
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { path: '/gold-silver-price', icon: '🥇', label: 'Gold' },
                    { path: '/electricity-calculator', icon: '⚡', label: 'EB Bill' },
                    { path: '/water-tax-calculator', icon: '💧', label: 'Water' },
                    { path: '/bus-tracking', icon: '📍', label: 'Track' },
                    { path: '/festival-calendar', icon: '📅', label: 'Calendar' },
                  ].map(q => (
                    <Link key={q.path} to={q.path} className="flex flex-col items-center gap-1 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
                      <span className="text-base">{q.icon}</span>
                      <span className="text-white/60 text-[8px] font-bold">{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NEXT BUS (Floating Card) ═══════ */}
      <Section className="px-4 -mt-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-200/60 p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                  <span className="text-white text-sm">🚌</span>
                </div>
                <div>
                  <h2 className="text-base font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{t('home.nextBus')}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-md tabular-nums" style={{ background: 'var(--c-primary)' }}>{currentTime}</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-dot" />
                    <span className="text-[11px] text-gray-400 font-medium">Live</span>
                  </div>
                </div>
              </div>
              <Link to="/bus-schedules" className="group flex items-center gap-1.5 text-sm font-bold hover:gap-2.5 transition-all duration-300" style={{ color: 'var(--c-primary)' }}>
                {t('home.fullList')}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {buses.map((bus, i) => (
                <div key={bus.id}
                  className="min-w-[170px] rounded-2xl p-4 flex-shrink-0 snap-start border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, #0C4A3E, #14856A)' : '#F8F7F4',
                    borderColor: i === 0 ? 'transparent' : '#E8E6E1',
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <p className={`text-2xl font-extrabold tabular-nums ${i === 0 ? 'text-white' : ''}`} style={{ color: i === 0 ? '' : 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
                    {bus.departure_time?.slice(0, 5)}
                  </p>
                  <p className={`text-sm font-bold mt-1.5 leading-snug ${i === 0 ? 'text-white/90' : ''}`} style={{ color: i === 0 ? '' : 'var(--c-text)' }}>
                    {l(bus, 'destination')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${bus.operator_type === 'government' ? (i === 0 ? 'bg-amber-400' : 'bg-teal-500') : 'bg-orange-500'}`} />
                    <span className={`text-[11px] font-semibold ${i === 0 ? 'text-white/70' : bus.operator_type === 'government' ? 'text-teal-700' : 'text-orange-600'}`}>
                      {bus.operator_type === 'government' ? t('home.government') : t('home.private')}
                    </span>
                  </div>
                  {bus.route_info_en && (
                    <p className={`text-[10px] mt-2 truncate ${i === 0 ? 'text-white/40' : 'text-gray-400'}`}>{l(bus, 'route_info')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ WIDGETS: WEATHER + GOLD + QUICK TOOLS ═══════ */}
      <Section className="px-4 py-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeatherCard />
          <div className="space-y-4">
            <GoldWidget />
            <QuickTools />
          </div>
        </div>
      </Section>

      {/* ═══════ TABBED CONTENT ═══════ */}
      <Section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Tab Buttons */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-3 mb-4">
            {[
              { key: 'services', label: `🏪 ${t('home.featuredServices')}`, count: categories.length },
              { key: 'jobs', label: `💼 ${t('home.latestJobs')}`, count: jobs.length },
              { key: 'news', label: `📰 ${t('home.latestArticles')}`, count: articles.length },
              { key: 'health', label: `🏥 ${t('healthcare.title')}`, count: healthCare.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setHomeTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${homeTab === tab.key ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'}`}
                style={homeTab === tab.key ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
                {tab.label} <span className="opacity-60 ml-0.5">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Tab: Services */}
          {homeTab === 'services' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 stagger-children">
                {displayCategories.map(cat => (
                  <Link key={cat.id} to={`/services?cat=${cat.slug}`} className="flex flex-col items-center gap-2.5 group">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-[20px] shadow-sm border border-gray-200/60 flex items-center justify-center text-xl md:text-2xl group-hover:shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ease-out">
                      {serviceIcons[cat.slug] || '📋'}
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold text-center leading-tight max-w-[70px] md:max-w-[80px] transition-colors duration-200 line-clamp-2" style={{ color: 'var(--c-text-muted)' }}>
                      {l(cat, 'name')}
                    </span>
                  </Link>
                ))}
              </div>
              <Link to="/services" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed transition-all group hover:border-solid"
                style={{ borderColor: 'rgba(12,74,62,0.2)', background: 'rgba(12,74,62,0.03)' }}>
                <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--c-primary)' }}>
                  {t('home.viewAll')} {categories.length} {t('home.moreServices')} →
                </span>
              </Link>
            </div>
          )}

          {/* Tab: Jobs */}
          {homeTab === 'jobs' && (
            <div className="animate-fade-in">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {jobs.map((job, i) => (
                  <div key={job.id} className="min-w-[270px] max-w-[310px] bg-white rounded-3xl p-5 flex-shrink-0 snap-start border border-gray-200/60 card-hover relative overflow-hidden">
                    <h3 className="font-extrabold text-[14px] leading-snug" style={{ color: 'var(--c-text)' }}>{l(job, 'title')}</h3>
                    <p className="text-sm font-bold mt-1" style={{ color: 'var(--c-primary-light)' }}>{job.company}</p>
                    <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>{l(job, 'description')}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      {job.deadline && <span className="text-[10px] text-gray-400">{new Date(job.deadline).toLocaleDateString()}</span>}
                      {job.apply_url && (
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] px-3 py-1.5 text-white rounded-lg font-bold"
                          style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                          {t('jobs.apply')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/jobs" className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed transition-all group hover:border-solid"
                style={{ borderColor: 'rgba(12,74,62,0.2)', background: 'rgba(12,74,62,0.03)' }}>
                <span className="text-sm font-bold opacity-60 group-hover:opacity-100" style={{ color: 'var(--c-primary)' }}>{t('home.viewAll')} Jobs →</span>
              </Link>
            </div>
          )}

          {/* Tab: News */}
          {homeTab === 'news' && (
            <div className="animate-fade-in space-y-3">
              {articles.map((article, idx) => {
                const accent = articleAccents[idx % articleAccents.length]
                return (
                  <Link key={article.id} to="/learn"
                    className={`block bg-gradient-to-r ${accent.gradient} rounded-2xl border ${accent.border} p-4 card-hover group`}>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${accent.tag} uppercase`}>{article.category}</span>
                    <h3 className="font-extrabold text-sm mt-2 leading-snug" style={{ color: 'var(--c-text)' }}>{l(article, 'title')}</h3>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--c-text-muted)' }}>{l(article, 'content')}</p>
                  </Link>
                )
              })}
              <Link to="/learn" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed transition-all group hover:border-solid"
                style={{ borderColor: 'rgba(12,74,62,0.2)', background: 'rgba(12,74,62,0.03)' }}>
                <span className="text-sm font-bold opacity-60 group-hover:opacity-100" style={{ color: 'var(--c-primary)' }}>{t('home.viewAll')} Articles →</span>
              </Link>
            </div>
          )}

          {/* Tab: Healthcare */}
          {homeTab === 'health' && (
            <div className="animate-fade-in">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {healthCare.map(item => {
                  const cfg = { insurance: { bg:'bg-blue-50', icon:'🛡️', tag:'bg-blue-100 text-blue-800' }, program: { bg:'bg-emerald-50', icon:'💚', tag:'bg-emerald-100 text-emerald-800' }, facility: { bg:'bg-purple-50', icon:'🏥', tag:'bg-purple-100 text-purple-800' } }[item.type] || { bg:'bg-emerald-50', icon:'💚', tag:'bg-emerald-100 text-emerald-800' }
                  return (
                    <div key={item.id} className="min-w-[250px] max-w-[300px] bg-white rounded-2xl p-5 flex-shrink-0 snap-start border border-gray-200/60 card-hover">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center text-base`}>{cfg.icon}</div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${cfg.tag} uppercase`}>{item.type}</span>
                      </div>
                      <h3 className="font-extrabold text-xs leading-snug" style={{ color: 'var(--c-text)' }}>{l(item, 'title')}</h3>
                      <p className="text-[11px] mt-2 line-clamp-3" style={{ color: 'var(--c-text-muted)' }}>{l(item, 'content')}</p>
                    </div>
                  )
                })}
              </div>
              <Link to="/healthcare" className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed transition-all group hover:border-solid"
                style={{ borderColor: 'rgba(12,74,62,0.2)', background: 'rgba(12,74,62,0.03)' }}>
                <span className="text-sm font-bold opacity-60 group-hover:opacity-100" style={{ color: 'var(--c-primary)' }}>{t('home.viewAll')} Healthcare →</span>
              </Link>
            </div>
          )}
        </div>
      </Section>

      <div className="h-6" />
    </div>
  )
}
