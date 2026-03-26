import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

// TN Town Panchayat Property Tax - Unit Area System
const ZONES = [
  { value: 'A', label: 'Zone A (Main Road / Commercial)', rate: 1.8 },
  { value: 'B', label: 'Zone B (Inner Roads / Residential)', rate: 1.2 },
  { value: 'C', label: 'Zone C (Village / Outskirts)', rate: 0.8 },
]
const BUILDING_TYPES = [
  { value: 'rcc', label: 'RCC / Concrete', factor: 1.0 },
  { value: 'tiled', label: 'Tiled Roof', factor: 0.75 },
  { value: 'sheet', label: 'Asbestos / Sheet', factor: 0.6 },
  { value: 'thatched', label: 'Thatched / Mud', factor: 0.4 },
]
const USAGE_TYPES = [
  { value: 'residential', label: 'Residential / வீட்டு பயன்பாடு', factor: 1.0 },
  { value: 'commercial', label: 'Commercial / வணிக பயன்பாடு', factor: 2.5 },
  { value: 'industrial', label: 'Industrial / தொழிற்சாலை', factor: 2.0 },
  { value: 'vacant', label: 'Vacant Land / காலி நிலம்', factor: 0.5 },
]
const TAX_RATE = 0.20 // 20% of Annual Rental Value for town panchayat

function calculate(area, zone, building, usage, floors, age) {
  if (!area || area <= 0) return null
  const z = ZONES.find(z => z.value === zone)
  const b = BUILDING_TYPES.find(b => b.value === building)
  const u = USAGE_TYPES.find(u => u.value === usage)
  if (!z || !b || !u) return null

  const baseRate = z.rate // per sq.ft per month
  const monthlyRentalValue = area * baseRate * b.factor * u.factor * (floors || 1)

  // Age depreciation: 1% per year, max 25%
  const depPct = Math.min((age || 0) * 1, 25)
  const afterDep = monthlyRentalValue * (1 - depPct / 100)

  const annualRentalValue = afterDep * 12
  const halfYearlyTax = (annualRentalValue * TAX_RATE) / 2

  // Library cess 10%
  const libraryCess = halfYearlyTax * 0.10
  const total = halfYearlyTax + libraryCess

  return { monthlyRental: afterDep, annualRV: annualRentalValue, halfYearlyTax, libraryCess, total, depPct }
}

export default function PropertyTaxCalc() {
  const [area, setArea] = useState('')
  const [zone, setZone] = useState('B')
  const [building, setBuilding] = useState('rcc')
  const [usage, setUsage] = useState('residential')
  const [floors, setFloors] = useState('1')
  const [age, setAge] = useState('0')

  const result = calculate(parseFloat(area), zone, building, usage, parseInt(floors), parseInt(age))

  const inputClass = "w-full px-3 py-3 border border-gray-200/60 rounded-xl text-sm font-bold outline-none focus:border-amber-400 text-center"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Property Tax Calculator" description="Calculate Annur Town Panchayat property tax by area, zone, building type" keywords="Annur property tax, house tax, panchayat tax calculator, Tamil Nadu" />
      <PageHeader title="Property Tax Calculator" subtitle="Annur Town Panchayat - சொத்து வரி கணக்கிடு" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(168,85,247,0.1)' }}>🏠</div>
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>Property Tax / சொத்து வரி</h3>
              <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Unit Area System (UAS) • Half-yearly</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Built-up Area (sq.ft) / கட்டிட பரப்பளவு *</label>
              <input type="number" min="0" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 1000" className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Zone / மண்டலம்</label>
              <select value={zone} onChange={e => setZone(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                {ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Building Type / கட்டிட வகை</label>
              <select value={building} onChange={e => setBuilding(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                {BUILDING_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Usage / பயன்பாடு</label>
              <select value={usage} onChange={e => setUsage(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                {USAGE_TYPES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>No. of Floors / தளங்கள்</label>
              <select value={floors} onChange={e => setFloors(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                {[1,2,3,4,5].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--c-text)' }}>Building Age (years)</label>
              <input type="number" min="0" max="50" value={age} onChange={e => setAge(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
          </div>

          {result && (
            <div className="animate-fade-in">
              <div className="text-center p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Half-Yearly Property Tax</p>
                <p className="text-white text-4xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{result.total.toFixed(0)}</p>
                <p className="text-white/40 text-xs mt-1">{area} sq.ft • {usage} • {result.depPct}% depreciation</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Monthly Rental Value', amount: result.monthlyRental },
                  { label: 'Annual Rental Value (ARV)', amount: result.annualRV },
                  { label: 'Property Tax (20% of ARV ÷ 2)', amount: result.halfYearlyTax },
                  { label: 'Library Cess (10%)', amount: result.libraryCess },
                ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{b.label}</p>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--c-text)' }}>₹{b.amount.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-center mt-4" style={{ color: '#C4C0B8' }}>* Approximate. Pay at Annur Town Panchayat Office or etownpanchayat.com</p>
      </div>
    </div>
  )
}
