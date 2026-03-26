import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const location = useLocation()

  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') return null

  return (
    <footer className="relative overflow-hidden mt-auto" style={{ background: 'linear-gradient(180deg, #0C1F1A 0%, #081412 100%)' }}>
      {/* Decorative mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #14856A, transparent)', transform: 'translate(30%, -40%)' }} />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)', transform: 'translate(-30%, 40%)' }} />

      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0C4A3E, #14856A)' }}>
                <span className="text-white font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>A</span>
              </div>
              <span className="text-white text-lg font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Annur</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">{t('footer.description')}</p>
          </div>
          <div>
            <h3 className="text-white text-xs font-bold mb-5 uppercase tracking-[0.2em]">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/officials', label: 'nav.officials' },
                { to: '/jobs', label: 'nav.jobs' },
                { to: '/services', label: 'nav.services' },
                { to: '/healthcare', label: 'nav.healthcare' },
                { to: '/bus-schedules', label: 'bus.title' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2.5 group">
                    <span className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150" style={{ background: '#14856A' }} />
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xs font-bold mb-5 uppercase tracking-[0.2em]">{t('footer.contactUs')}</h3>
            <div className="space-y-3.5">
              <a href="mailto:info@annur.in" className="flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(20, 133, 106, 0.15)' }}>
                  <svg className="w-3.5 h-3.5" style={{ color: '#14856A' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                info@annur.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(20, 133, 106, 0.15)' }}>
                  <svg className="w-3.5 h-3.5" style={{ color: '#14856A' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                +91 9876543210
              </a>
            </div>
            <Link to="/admin/login" className="text-[11px] text-gray-700 hover:text-gray-400 mt-8 inline-block transition-colors font-medium">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 text-center py-5 text-[11px] text-gray-600 font-medium">
        &copy; {new Date().getFullYear()} Annur Community Portal. {t('footer.rights')}
      </div>
    </footer>
  )
}
