import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

const toolGroups = [
  {
    title: 'Price Trackers',
    ta: 'விலை கண்காணிப்பு',
    tools: [
      { path: '/gold-silver-price', icon: '🥇', label: 'Gold & Silver Price', ta: 'தங்கம் & வெள்ளி விலை', desc: 'Live 22K, 24K gold and silver rates' },
    ]
  },
  {
    title: 'Bill Calculators',
    ta: 'பில் கணக்கிடு',
    tools: [
      { path: '/electricity-calculator', icon: '⚡', label: 'TNEB Bill Calculator', ta: 'மின் கட்டண கணக்கிடு', desc: 'Domestic, commercial & industrial slab rates' },
      { path: '/water-tax-calculator', icon: '💧', label: 'Water Tax Calculator', ta: 'நீர் வரி கணக்கிடு', desc: 'Panchayat water charge estimation' },
      { path: '/property-tax-calculator', icon: '🏠', label: 'Property Tax', ta: 'சொத்து வரி', desc: 'Town panchayat house tax by sq.ft' },
    ]
  },
  {
    title: 'Finance Tools',
    ta: 'நிதி கருவிகள்',
    tools: [
      { path: '/emi-calculator', icon: '🏦', label: 'Loan EMI Calculator', ta: 'கடன் EMI கணக்கிடு', desc: 'Home, car, bike, personal loan EMI' },
      { path: '/fd-rd-calculator', icon: '💰', label: 'FD/RD Calculator', ta: 'வைப்பு நிதி கணக்கிடு', desc: 'Fixed deposit & recurring deposit returns' },
      { path: '/income-tax-calculator', icon: '💵', label: 'Income Tax Calculator', ta: 'வருமான வரி', desc: 'Old vs New regime comparison FY 2025-26' },
    ]
  },
  {
    title: 'Health & Lifestyle',
    ta: 'ஆரோக்கியம்',
    tools: [
      { path: '/bmi-calculator', icon: '💪', label: 'BMI & Health Calculator', ta: 'BMI கணக்கிடு', desc: 'BMI, daily water, calorie needs' },
      { path: '/blood-donors', icon: '🩸', label: 'Blood Donor Directory', ta: 'இரத்த தான கையேடு', desc: 'Find donors by blood group' },
    ]
  },
  {
    title: 'Transport & Travel',
    ta: 'போக்குவரத்து',
    tools: [
      { path: '/bus-tracking', icon: '📍', label: 'Bus Live Tracking', ta: 'பஸ் ட்ராக்கிங்', desc: 'Real-time bus positions on map' },
      { path: '/bus-schedules', icon: '🚌', label: 'Bus Schedules', ta: 'பேருந்து அட்டவணை', desc: '150+ routes from Annur bus stand' },
    ]
  },
  {
    title: 'Calendar & Info',
    ta: 'காலண்டர்',
    tools: [
      { path: '/festival-calendar', icon: '📅', label: 'Tamil Calendar 2026', ta: 'தமிழ் காலண்டர்', desc: 'Panchangam, nakshatram, nalla neram' },
      { path: '/contacts', icon: '📞', label: 'Contact Directory', ta: 'தொடர்பு கையேடு', desc: 'Searchable phone book of Annur' },
      { path: '/complaints', icon: '📢', label: 'File Complaint', ta: 'புகார்', desc: 'Report issues to panchayat' },
    ]
  },
]

export default function Tools() {
  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Tools & Calculators" description="Useful tools for Annur residents - EB bill, water tax, gold price, EMI, income tax calculators" keywords="Annur tools, calculator, TNEB, water tax, gold price, EMI" />
      <PageHeader title="Tools & Calculators" subtitle="கருவிகள் & கணக்கிடு - Useful tools for daily life" />

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-12 space-y-6">
        {toolGroups.map(group => (
          <div key={group.title}>
            <h3 className="text-sm font-extrabold mb-3 flex items-center gap-2" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
              {group.title} <span className="text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>/ {group.ta}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.tools.map(tool => (
                <Link key={tool.path} to={tool.path}
                  className="bg-white rounded-2xl border border-gray-200/60 p-4 flex items-start gap-3 card-hover group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform" style={{ background: '#F8F7F4' }}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm" style={{ color: 'var(--c-text)' }}>{tool.label}</h4>
                    <p className="text-[10px] font-bold" style={{ color: 'var(--c-primary-light)' }}>{tool.ta}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{tool.desc}</p>
                  </div>
                  <svg className="w-4 h-4 shrink-0 mt-1 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--c-primary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
