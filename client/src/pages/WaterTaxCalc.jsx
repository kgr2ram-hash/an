import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

// Tamil Nadu Town Panchayat water tax rates (standard rates - Annur)
const WATER_RATES = {
  domestic: {
    label: 'Domestic / வீட்டு பயன்பாடு',
    icon: '🏠',
    connectionCharge: 3000,
    monthlyBase: 60,
    perKL: 4, // per 1000 litres
    slabs: [
      { upto: 10, rate: 0, label: '0-10 KL (Free)' },
      { upto: 25, rate: 4, label: '11-25 KL' },
      { upto: 50, rate: 7, label: '26-50 KL' },
      { upto: Infinity, rate: 12, label: '50+ KL' },
    ]
  },
  commercial: {
    label: 'Commercial / வணிக பயன்பாடு',
    icon: '🏪',
    connectionCharge: 8000,
    monthlyBase: 150,
    perKL: 10,
    slabs: [
      { upto: 10, rate: 10, label: '0-10 KL' },
      { upto: 25, rate: 15, label: '11-25 KL' },
      { upto: 50, rate: 20, label: '26-50 KL' },
      { upto: Infinity, rate: 30, label: '50+ KL' },
    ]
  },
  industrial: {
    label: 'Industrial / தொழிற்சாலை',
    icon: '🏭',
    connectionCharge: 15000,
    monthlyBase: 300,
    perKL: 20,
    slabs: [
      { upto: 25, rate: 20, label: '0-25 KL' },
      { upto: 50, rate: 30, label: '26-50 KL' },
      { upto: Infinity, rate: 45, label: '50+ KL' },
    ]
  }
}

function calculateWaterBill(type, usage) {
  const config = WATER_RATES[type]
  if (!config || !usage || usage <= 0) return null

  let remaining = usage
  let total = config.monthlyBase
  const breakdown = [{ slab: 'Monthly Base Charge', units: '-', rate: '-', amount: config.monthlyBase }]
  let prev = 0

  for (const slab of config.slabs) {
    const slabUnits = Math.min(remaining, slab.upto - prev)
    if (slabUnits <= 0) break
    const amount = slabUnits * slab.rate
    breakdown.push({ slab: slab.label, units: slabUnits, rate: slab.rate, amount })
    total += amount
    remaining -= slabUnits
    prev = slab.upto
  }

  return { total, breakdown }
}

export default function WaterTaxCalc() {
  const [type, setType] = useState('domestic')
  const [usage, setUsage] = useState('')
  const [months, setMonths] = useState('1')

  const result = usage ? calculateWaterBill(type, parseInt(usage) || 0) : null
  const config = WATER_RATES[type]
  const totalWithMonths = result ? result.total * (parseInt(months) || 1) : 0

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Water Tax Calculator" description="Calculate Annur Town Panchayat water tax and charges for domestic, commercial and industrial connections" keywords="Annur water tax, panchayat water charge, water bill calculator, Tamil Nadu" />
      <PageHeader title="Water Tax Calculator" subtitle="Annur Town Panchayat - Water Charge Estimation" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(6,182,212,0.1)' }}>💧</div>
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Water Bill Calculator</h3>
              <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Annur Town Panchayat / அன்னூர் நகராட்சி</p>
            </div>
          </div>

          {/* Connection Type */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Connection Type / இணைப்பு வகை</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(WATER_RATES).map(([key, val]) => (
                <button key={key} onClick={() => setType(key)}
                  className={`p-3 rounded-2xl border text-center transition-all ${type === key ? 'border-cyan-400 ring-1 ring-cyan-200' : 'border-gray-200/60 hover:border-cyan-300'}`}
                  style={type === key ? { background: 'rgba(6,182,212,0.06)' } : {}}>
                  <span className="text-2xl block mb-1">{val.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: type === key ? '#0891B2' : 'var(--c-text-muted)' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Usage Input */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Monthly Usage (KL) / மாத நுகர்வு</label>
              <input type="number" min="0" value={usage} onChange={e => setUsage(e.target.value)} placeholder="e.g. 15"
                className="w-full px-4 py-3.5 border border-gray-200/60 rounded-2xl text-lg font-bold text-center outline-none focus:border-[#0891B2] focus:shadow-[0_0_0_3px_rgba(8,145,178,0.08)]"
                style={{ background: '#F8F7F4', color: 'var(--c-text)' }} />
              <p className="text-[10px] mt-1 text-center" style={{ color: '#C4C0B8' }}>1 KL = 1000 Litres</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Period (Months) / காலம்</label>
              <select value={months} onChange={e => setMonths(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200/60 rounded-2xl text-lg font-bold text-center outline-none focus:border-[#0891B2]"
                style={{ background: '#F8F7F4', color: 'var(--c-text)' }}>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months (Half-Year)</option>
                <option value="12">12 Months (Annual)</option>
              </select>
            </div>
          </div>

          {/* Result */}
          {result && parseInt(usage) > 0 && (
            <div className="animate-fade-in">
              {/* Total */}
              <div className="text-center p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #0E7490, #06B6D4)' }}>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Estimated Water Charge</p>
                <p className="text-white text-4xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  ₹{totalWithMonths.toFixed(2)}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {usage} KL × {months} month{parseInt(months) > 1 ? 's' : ''} ({config.label.split('/')[0].trim()})
                </p>
                {parseInt(months) > 1 && (
                  <p className="text-white/50 text-[10px] mt-0.5">Monthly: ₹{result.total.toFixed(2)}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Monthly Breakdown</p>
                {result.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{b.slab}</p>
                      {b.units !== '-' && <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>{b.units} KL × ₹{b.rate}/KL</p>}
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--c-text)' }}>₹{b.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                  <p className="text-sm font-extrabold text-cyan-800">Monthly Total</p>
                  <span className="text-lg font-extrabold text-cyan-800">₹{result.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rate Table */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-200/60 p-5">
          <h4 className="font-extrabold text-sm mb-3" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
            {config.icon} {config.label} - Rate Card
          </h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span style={{ color: 'var(--c-text-muted)' }}>New Connection Charge</span>
              <span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{config.connectionCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span style={{ color: 'var(--c-text-muted)' }}>Monthly Base Charge</span>
              <span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{config.monthlyBase}</span>
            </div>
            {config.slabs.map((s, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span style={{ color: 'var(--c-text-muted)' }}>{s.label}</span>
                <span className="font-bold" style={{ color: 'var(--c-text)' }}>{s.rate === 0 ? 'Free' : `₹${s.rate}/KL`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/40 rounded-3xl p-5">
          <h4 className="font-extrabold text-cyan-900 text-sm mb-2">💡 Important Info</h4>
          <ul className="text-xs text-cyan-800/70 space-y-1.5">
            <li>• Water tax is collected by Annur Town Panchayat half-yearly (6 months)</li>
            <li>• Pay at Town Panchayat Office or via eTownPanchayat.com</li>
            <li>• New connection: Apply at Panchayat Office with property documents</li>
            <li>• Complaint: Call 0425-4299908 for water supply issues</li>
            <li>• 1 KL (Kilolitre) = 1000 Litres. Avg family uses 10-20 KL/month</li>
          </ul>
        </div>

        <p className="text-[10px] text-center mt-4" style={{ color: '#C4C0B8' }}>
          * Approximate rates. Actual charges may vary. Contact Annur Town Panchayat for exact rates.
        </p>
      </div>
    </div>
  )
}
