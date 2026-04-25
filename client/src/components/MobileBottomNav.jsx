import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const mainNav = [
  { path: '/', label: 'nav.home', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>
  )},
  { path: '/services', label: 'nav.services', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  )},
  { path: '/jobs', label: 'nav.jobs', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v6M8 6H6a2 2 0 00-2 2v6" /></svg>
  )},
  { path: '/bus-schedules', label: 'bus.title', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h8m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
  )},
]

const moreLinks = [
  { path: '/sports', icon: '🏆', label: 'Sports' },
  { path: '/events', icon: '📅', label: 'Events' },
  { path: '/officials', icon: '👤', label: 'Officials' },
  { path: '/learn', icon: '📰', label: 'News' },
  { path: '/healthcare', icon: '🏥', label: 'Healthcare' },
  { path: '/contacts', icon: '📞', label: 'Contacts' },
  { path: '/complaints', icon: '📢', label: 'Complaint' },
  { path: '/bus-tracking', icon: '📍', label: 'Bus Track' },
  { path: '/blood-donors', icon: '🩸', label: 'Blood' },
  { path: '/gallery', icon: '🖼️', label: 'Gallery' },
  { path: '/news-feed', icon: '📰', label: 'News Feed' },
  { path: '/festival-calendar', icon: '📅', label: 'Calendar' },
  { path: '/gold-silver-price', icon: '🥇', label: 'Gold Rate' },
  { path: '/electricity-calculator', icon: '⚡', label: 'EB Bill' },
  { path: '/water-tax-calculator', icon: '💧', label: 'Water Tax' },
  { path: '/emi-calculator', icon: '🏦', label: 'EMI Calc' },
  { path: '/property-tax-calculator', icon: '🏠', label: 'Property Tax' },
  { path: '/income-tax-calculator', icon: '💵', label: 'Income Tax' },
  { path: '/fd-rd-calculator', icon: '💰', label: 'FD/RD' },
  { path: '/bmi-calculator', icon: '💪', label: 'BMI Health' },
  { path: '/services/submit', icon: '➕', label: 'Add Business' },
]

export default function MobileBottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  if (location.pathname.startsWith('/admin')) return null

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-[72px] left-2 right-2 animate-slide-up">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'var(--c-card, white)' }}>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>More Pages & Tools</h3>
                <button onClick={() => setShowMore(false)} className="text-lg" style={{ color: 'var(--c-text-muted)' }}>&times;</button>
              </div>
              <div className="p-3 grid grid-cols-4 gap-1 max-h-[60vh] overflow-y-auto">
                {moreLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setShowMore(false)}
                    className="flex flex-col items-center gap-1 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-[9px] font-bold text-center leading-tight" style={{ color: 'var(--c-text-muted)' }}>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-[72px] border-t shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        style={{ background: 'rgba(250, 250, 247, 0.92)', backdropFilter: 'blur(20px) saturate(1.8)', WebkitBackdropFilter: 'blur(20px) saturate(1.8)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {mainNav.map(item => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
          return (
            <Link key={item.path} to={item.path}
              className="flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-300"
              style={{ color: isActive ? 'var(--c-primary)' : '#9CA3AF' }}>
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                {isActive && <div className="absolute -inset-2 rounded-xl opacity-15" style={{ background: 'var(--c-primary)' }} />}
                <div className="relative">{item.icon}</div>
              </div>
              <span className="text-[10px] font-bold truncate max-w-[56px]">{t(item.label)}</span>
              {isActive && <div className="absolute bottom-1.5 w-5 h-0.5 rounded-full" style={{ background: 'var(--c-primary)' }} />}
            </Link>
          )
        })}
        {/* More button */}
        <button onClick={() => setShowMore(!showMore)}
          className="flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-300"
          style={{ color: showMore ? 'var(--c-primary)' : '#9CA3AF' }}>
          <div className={`relative transition-all duration-300 ${showMore ? 'scale-110 -translate-y-0.5' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[10px] font-bold">More</span>
        </button>
      </nav>
    </>
  )
}
