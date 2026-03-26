import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

// TNEB Tariff 2026 (effective 01.07.2025) - TNERC approved
const TARIFFS = {
  domestic: {
    label: 'Domestic (LT I-A)',
    ta: 'வீட்டு பயன்பாடு',
    icon: '🏠',
    fixedCharge: 0,
    slabs: [
      { upto: 100, rate: 0, label: '0-100 units (Free)' },
      { upto: 200, rate: 2.35, label: '101-200 units' },
      { upto: 400, rate: 4.70, label: '201-400 units' },
      { upto: 500, rate: 6.30, label: '401-500 units' },
      { upto: 600, rate: 8.40, label: '501-600 units' },
      { upto: 800, rate: 9.45, label: '601-800 units' },
      { upto: 1000, rate: 10.50, label: '801-1000 units' },
      { upto: Infinity, rate: 11.55, label: '1000+ units' },
    ],
    note: 'First 100 units FREE for all domestic connections. No fixed charge.',
  },
  commercial: {
    label: 'Commercial (LT V)',
    ta: 'வணிக பயன்பாடு',
    icon: '🏪',
    fixedCharge: 214, // per KW per 2 months (billing cycle)
    slabs: [
      { upto: 100, rate: 6.45, label: '0-100 units' },
      { upto: Infinity, rate: 10.15, label: '100+ units' },
    ],
    note: 'Fixed charge: ₹214/KW per billing cycle (2 months). Demand charge applies.',
  },
  industrial: {
    label: 'Industrial (LT III-B)',
    ta: 'தொழிற்சாலை',
    icon: '🏭',
    fixedCharge: 162, // per KW per 2 months (up to 25KW)
    slabs: [
      { upto: Infinity, rate: 8.00, label: 'All units' },
    ],
    note: 'Fixed charge: ₹162-589/KW based on connected load. Flat rate ₹8.00/unit.',
  },
  agriculture: {
    label: 'Agriculture (LT IV-A)',
    ta: 'விவசாயம்',
    icon: '🌾',
    fixedCharge: 0,
    slabs: [
      { upto: Infinity, rate: 0, label: 'All units (Free)' },
    ],
    note: 'FREE electricity for agriculture pump sets (up to 10 HP). Government subsidized.',
  },
}

function calculateBill(type, units, connectedLoad) {
  const config = TARIFFS[type]
  if (!config || !units || units <= 0) return null

  let remaining = units
  let energyCharge = 0
  const breakdown = []
  let prev = 0

  for (const slab of config.slabs) {
    const slabUnits = Math.min(remaining, slab.upto - prev)
    if (slabUnits <= 0) break
    const amount = slabUnits * slab.rate
    breakdown.push({ slab: slab.label, units: slabUnits, rate: slab.rate, amount })
    energyCharge += amount
    remaining -= slabUnits
    prev = slab.upto
  }

  const load = parseFloat(connectedLoad) || 1
  const fixedAmount = config.fixedCharge * load
  const total = energyCharge + fixedAmount

  return { energyCharge, fixedAmount, total, breakdown, note: config.note }
}

export default function ElectricityCalc() {
  const [type, setType] = useState('domestic')
  const [units, setUnits] = useState('')
  const [connectedLoad, setConnectedLoad] = useState('1')
  const [period, setPeriod] = useState('1') // billing cycles (1 = 2 months)

  const result = units ? calculateBill(type, parseInt(units) || 0, connectedLoad) : null
  const config = TARIFFS[type]
  const totalWithPeriod = result ? result.total * (parseInt(period) || 1) : 0

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="TNEB Bill Calculator" description="Calculate TNEB electricity bill for domestic, commercial, industrial. Latest 2026 slab rates for Annur, Coimbatore." keywords="TNEB calculator, electricity bill, Annur, Coimbatore, domestic, commercial, slab rate, 2026" />
      <PageHeader title="TNEB Bill Calculator" subtitle="Tamil Nadu Electricity Board - Bill Estimation 2026" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(245,158,11,0.1)' }}>⚡</div>
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>TNEB Bill Calculator</h3>
              <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>TANGEDCO / தமிழ்நாடு மின் வாரியம் • Rates from 01.07.2025</p>
            </div>
          </div>

          {/* Connection Type */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Connection Type / இணைப்பு வகை</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(TARIFFS).map(([key, val]) => (
                <button key={key} onClick={() => setType(key)}
                  className={`p-3 rounded-2xl border text-center transition-all ${type === key ? 'border-amber-400 ring-1 ring-amber-200' : 'border-gray-200/60 hover:border-amber-300'}`}
                  style={type === key ? { background: 'rgba(245,158,11,0.06)' } : {}}>
                  <span className="text-2xl block mb-1">{val.icon}</span>
                  <span className="text-[10px] font-bold block" style={{ color: type === key ? '#B45309' : 'var(--c-text-muted)' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="text-[8px] block" style={{ color: 'var(--c-text-muted)' }}>{val.ta}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Units Consumed (Bi-monthly)</label>
              <input type="number" min="0" value={units} onChange={e => setUnits(e.target.value)} placeholder="e.g. 250"
                className="w-full px-4 py-3.5 border border-gray-200/60 rounded-2xl text-lg font-bold text-center outline-none focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]"
                style={{ background: '#F8F7F4', color: 'var(--c-text)' }} />
              <p className="text-[10px] mt-1 text-center" style={{ color: '#C4C0B8' }}>Per billing cycle (2 months)</p>
            </div>
            {type !== 'domestic' && type !== 'agriculture' && (
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Connected Load (KW)</label>
                <input type="number" min="0.5" step="0.5" value={connectedLoad} onChange={e => setConnectedLoad(e.target.value)} placeholder="e.g. 5"
                  className="w-full px-4 py-3.5 border border-gray-200/60 rounded-2xl text-lg font-bold text-center outline-none focus:border-amber-400"
                  style={{ background: '#F8F7F4', color: 'var(--c-text)' }} />
              </div>
            )}
            <div className={type === 'domestic' || type === 'agriculture' ? '' : 'col-span-2 sm:col-span-1'}>
              <label className="block text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>Billing Cycles</label>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200/60 rounded-2xl text-lg font-bold text-center outline-none"
                style={{ background: '#F8F7F4', color: 'var(--c-text)' }}>
                <option value="1">1 Cycle (2 months)</option>
                <option value="3">3 Cycles (6 months)</option>
                <option value="6">6 Cycles (1 year)</option>
              </select>
            </div>
          </div>

          {/* Result */}
          {result && parseInt(units) > 0 && (
            <div className="animate-fade-in">
              <div className="text-center p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Estimated Bill ({config.label})</p>
                <p className="text-white text-4xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  ₹{totalWithPeriod.toFixed(2)}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {units} units × {period} cycle{parseInt(period) > 1 ? 's' : ''} ({parseInt(period) * 2} months)
                </p>
                {parseInt(period) > 1 && (
                  <p className="text-white/50 text-[10px] mt-0.5">Per cycle: ₹{result.total.toFixed(2)}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Breakdown (per billing cycle)</p>
                {result.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{b.slab}</p>
                      <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>{b.units} units × ₹{b.rate}/unit</p>
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: b.rate === 0 ? '#10B981' : 'var(--c-text)' }}>
                      {b.rate === 0 ? 'FREE' : `₹${b.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
                {result.fixedAmount > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>Fixed / Demand Charge</p>
                      <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>₹{config.fixedCharge}/KW × {connectedLoad} KW</p>
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--c-text)' }}>₹{result.fixedAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-sm font-extrabold text-amber-800">Total (per cycle)</p>
                  <span className="text-lg font-extrabold text-amber-800">₹{result.total.toFixed(2)}</span>
                </div>
              </div>

              {result.note && (
                <p className="text-[10px] mt-3 p-2 rounded-lg bg-blue-50 text-blue-700 font-bold">{result.note}</p>
              )}
            </div>
          )}
        </div>

        {/* Rate Table */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-200/60 p-5">
          <h4 className="font-extrabold text-sm mb-3" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
            {config.icon} TNEB {config.label} Slab Rates
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-left text-[10px] font-bold uppercase" style={{ color: 'var(--c-text-muted)' }}>Slab</th>
                  <th className="py-2 text-right text-[10px] font-bold uppercase" style={{ color: 'var(--c-text-muted)' }}>Rate (₹/unit)</th>
                </tr>
              </thead>
              <tbody>
                {config.slabs.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 font-bold" style={{ color: 'var(--c-text)' }}>{s.label}</td>
                    <td className="py-2 text-right font-extrabold" style={{ color: s.rate === 0 ? '#10B981' : '#B45309' }}>
                      {s.rate === 0 ? 'FREE' : `₹${s.rate}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {config.fixedCharge > 0 && (
            <p className="text-xs mt-2 font-bold" style={{ color: 'var(--c-text-muted)' }}>
              + Fixed charge: ₹{config.fixedCharge}/KW per billing cycle
            </p>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/40 rounded-3xl p-5">
          <h4 className="font-extrabold text-amber-900 text-sm mb-2">💡 Important Info</h4>
          <ul className="text-xs text-amber-800/70 space-y-1.5">
            <li>• TNEB bills are <b>bi-monthly</b> (every 2 months)</li>
            <li>• First 100 units FREE for domestic connections</li>
            <li>• Agriculture pump sets: FREE electricity (up to 10 HP)</li>
            <li>• Peak hour surcharge: 25% extra (06:00-09:00 & 18:00-21:00) for HT</li>
            <li>• Night discount: 5% off (22:00-05:00) for select categories</li>
            <li>• Pay online: tangedco.org | Complaint: 1912</li>
            <li>• Rates effective from 01.07.2025 (TNERC approved)</li>
          </ul>
        </div>

        <p className="text-[10px] text-center mt-4" style={{ color: '#C4C0B8' }}>
          * Approximate calculation. Actual bill may include meter rent, tax and other charges. Source: TNERC / TANGEDCO
        </p>
      </div>
    </div>
  )
}
