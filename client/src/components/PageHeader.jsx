import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, backTo, backLabel, children }) {
  return (
    <div className="relative overflow-hidden wave-divider" style={{ background: 'linear-gradient(135deg, #0C4A3E 0%, #0E6B52 40%, #18A67A 100%)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="mesh-blob w-[400px] h-[400px] bg-[#F59E0B]/15 top-[-80px] right-[-80px]" />
        <div className="mesh-blob w-[300px] h-[300px] bg-[#14856A]/25 bottom-[-60px] left-[-40px]" />
      </div>
      <div className="absolute inset-0 noise-overlay" />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {backTo && (
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-3 transition-colors font-bold group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            {backLabel}
          </Link>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h1>
            {subtitle && <p className="text-white/50 mt-2 text-sm md:text-base max-w-lg">{subtitle}</p>}
          </div>
          {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  )
}
