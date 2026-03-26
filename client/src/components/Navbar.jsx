import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useUser } from '../context/UserContext.jsx'

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/services', label: 'nav.services' },
  { path: '/jobs', label: 'nav.jobs' },
  { path: '/bus-schedules', label: 'bus.title' },
  { path: '/events', label: 'nav.events' },
]

const moreDesktopLinks = [
  { path: '/officials', label: 'Officials', icon: '👤' },
  { path: '/learn', label: 'News & Articles', icon: '📰' },
  { path: '/healthcare', label: 'Healthcare', icon: '🏥' },
  { path: '/contacts', label: 'Contact Directory', icon: '📞' },
  { path: '/complaints', label: 'Complaints', icon: '📢' },
  { path: '/bus-tracking', label: 'Bus Live Tracking', icon: '📍' },
  { path: '/blood-donors', label: 'Blood Donors', icon: '🩸' },
  { path: '/gallery', label: 'Gallery', icon: '🖼️' },
  { path: '/news-feed', label: 'News Feed', icon: '📰' },
  { path: '/festival-calendar', label: 'Tamil Calendar', icon: '📅' },
  { path: '/gold-silver-price', label: 'Gold & Silver Price', icon: '🥇' },
  { path: '/electricity-calculator', label: 'EB Bill Calculator', icon: '⚡' },
  { path: '/water-tax-calculator', label: 'Water Tax Calculator', icon: '💧' },
  { path: '/emi-calculator', label: 'EMI Calculator', icon: '🏦' },
  { path: '/bmi-calculator', label: 'BMI Health', icon: '💪' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, isLoggedIn } = useUser()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDesktopMore, setShowDesktopMore] = useState(false)
  const moreRef = useRef(null)

  // Close desktop more on outside click
  useEffect(() => {
    const handler = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setShowDesktopMore(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') return null

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/[0.03] border-b border-gray-200/40'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                <span className="text-white font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>A</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gradient" style={{ fontFamily: 'var(--font-display)' }}>Annur</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'hover:bg-[#0C4A3E]/5'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #0C4A3E, #14856A)',
                      color: 'white',
                    } : { color: 'var(--c-text-muted)' }}
                  >
                    {t(link.label)}
                  </Link>
                )
              })}
              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button onClick={() => setShowDesktopMore(!showDesktopMore)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${showDesktopMore ? 'text-white' : ''}`}
                  style={showDesktopMore ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
                  More ▾
                </button>
                {showDesktopMore && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden animate-slide-down z-50">
                    <div className="max-h-[70vh] overflow-y-auto p-2">
                      {moreDesktopLinks.map(link => (
                        <Link key={link.path} to={link.path} onClick={() => setShowDesktopMore(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                          style={{ color: location.pathname === link.path ? 'var(--c-primary)' : 'var(--c-text-muted)' }}>
                          <span>{link.icon}</span> {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-2 pl-2 border-l border-gray-200/60 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
                {isLoggedIn ? (
                  <Link to="/profile" className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }} title={user?.name}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Link>
                ) : (
                  <Link to="/login" className="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-gray-100" style={{ color: 'var(--c-primary)' }}>
                    Login
                  </Link>
                )}
              </div>
            </div>

            <button
              className="md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100/80 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ background: 'var(--c-text)' }} />
                <span className={`block h-0.5 rounded-full transition-all duration-200 ${open ? 'opacity-0 scale-0' : ''}`} style={{ background: 'var(--c-text)' }} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} style={{ background: 'var(--c-text)' }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 z-40" style={{ top: '64px' }}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white shadow-2xl border-b border-gray-200 animate-slide-down rounded-b-2xl">
            <div className="p-3 space-y-1">
              {navLinks.map(link => {
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'text-white shadow-md' : 'hover:bg-gray-50'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #0C4A3E, #14856A)',
                    } : { color: 'var(--c-text)' }}
                  >
                    {t(link.label)}
                  </Link>
                )
              })}
              <div className="pt-3 px-4 border-t border-gray-100 mt-2 flex items-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
