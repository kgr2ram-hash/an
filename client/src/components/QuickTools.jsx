import { Link } from 'react-router-dom'

const tools = [
  { path: '/gold-silver-price', icon: '🥇', label: 'Gold Price', ta: 'தங்க விலை' },
  { path: '/electricity-calculator', icon: '⚡', label: 'EB Bill Calc', ta: 'மின் கட்டணம்' },
  { path: '/water-tax-calculator', icon: '💧', label: 'Water Tax', ta: 'நீர் வரி' },
  { path: '/bus-tracking', icon: '📍', label: 'Bus Tracking', ta: 'பஸ் ட்ராக்கிங்' },
  { path: '/blood-donors', icon: '🩸', label: 'Blood Donors', ta: 'இரத்த தானம்' },
  { path: '/festival-calendar', icon: '📅', label: 'Tamil Calendar', ta: 'தமிழ் காலண்டர்' },
  { path: '/contacts', icon: '📞', label: 'Phone Book', ta: 'தொலைபேசி புத்தகம்' },
  { path: '/complaints', icon: '📢', label: 'Complaint', ta: 'புகார்' },
  { path: '/news-feed', icon: '📰', label: 'News Feed', ta: 'செய்தி' },
  { path: '/emi-calculator', icon: '🏦', label: 'EMI Calc', ta: 'EMI கணக்கு' },
  { path: '/property-tax-calculator', icon: '🏠', label: 'Property Tax', ta: 'சொத்து வரி' },
  { path: '/income-tax-calculator', icon: '💵', label: 'Income Tax', ta: 'வருமான வரி' },
  { path: '/fd-rd-calculator', icon: '💰', label: 'FD/RD', ta: 'வைப்பு நிதி' },
  { path: '/bmi-calculator', icon: '💪', label: 'BMI Health', ta: 'உடல் நலம்' },
]

export default function QuickTools() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/60 p-5">
      <h3 className="text-base font-extrabold mb-4" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
        Quick Tools / விரைவு கருவிகள்
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {tools.map(t => (
          <Link key={t.path} to={t.path} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 transition-colors group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ background: '#F8F7F4' }}>
              {t.icon}
            </div>
            <span className="text-[10px] font-bold text-center leading-tight line-clamp-1" style={{ color: 'var(--c-text-muted)' }}>{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
