import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

// FY 2025-26 Tax Slabs
const OLD_REGIME = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 5 },
  { upto: 1000000, rate: 20 },
  { upto: Infinity, rate: 30 },
]
const NEW_REGIME = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 5 },
  { upto: 1200000, rate: 10 },
  { upto: 1600000, rate: 15 },
  { upto: 2000000, rate: 20 },
  { upto: 2400000, rate: 25 },
  { upto: Infinity, rate: 30 },
]

function calcTax(income, slabs, deductions = 0) {
  const taxable = Math.max(0, income - deductions)
  let tax = 0, prev = 0
  const breakdown = []
  for (const slab of slabs) {
    const amt = Math.min(taxable, slab.upto) - prev
    if (amt <= 0) break
    const t = amt * slab.rate / 100
    breakdown.push({ range: `₹${(prev/100000).toFixed(1)}L - ₹${slab.upto === Infinity ? '∞' : (slab.upto/100000).toFixed(1)+'L'}`, rate: slab.rate, amount: amt, tax: t })
    tax += t
    prev = slab.upto
  }
  // Rebate u/s 87A
  let rebate = 0
  if (taxable <= 700000 && deductions > 0) rebate = Math.min(tax, 12500) // old regime
  if (taxable <= 1200000 && deductions === 0) rebate = Math.min(tax, 60000) // new regime
  const afterRebate = Math.max(0, tax - rebate)
  const cess = afterRebate * 0.04
  return { taxable, tax, rebate, afterRebate, cess, total: afterRebate + cess, breakdown }
}

export default function IncomeTaxCalc() {
  const [income, setIncome] = useState('800000')
  const [deductions, setDeductions] = useState('150000')

  const oldResult = calcTax(parseFloat(income) || 0, OLD_REGIME, parseFloat(deductions) || 0)
  const newResult = calcTax(parseFloat(income) || 0, NEW_REGIME, 75000) // standard deduction only in new regime
  const savings = oldResult.total - newResult.total
  const betterRegime = savings > 0 ? 'New' : 'Old'

  const inputClass = "w-full px-3 py-3 border border-gray-200/60 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 text-center"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Income Tax Calculator" description="Calculate income tax FY 2025-26. Old vs New regime comparison." keywords="income tax calculator, old regime, new regime, FY 2025-26, tax slab" />
      <PageHeader title="Income Tax Calculator" subtitle="வருமான வரி கணக்கிடு - FY 2025-26 (AY 2026-27)" />

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Annual Income (₹) / ஆண்டு வருமானம்</label>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Deductions - 80C, 80D etc (₹) [Old Regime]</label>
              <input type="number" value={deductions} onChange={e => setDeductions(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
          </div>

          {/* Recommendation */}
          <div className={`text-center p-4 rounded-2xl mb-5 ${betterRegime === 'New' ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200'}`}>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--c-text-muted)' }}>Recommended</p>
            <p className={`text-xl font-extrabold ${betterRegime === 'New' ? 'text-emerald-700' : 'text-blue-700'}`} style={{ fontFamily: 'var(--font-display)' }}>
              {betterRegime} Regime saves you ₹{Math.abs(savings).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Side by Side Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Old Regime */}
            <div className="rounded-2xl overflow-hidden border border-blue-200/60">
              <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}>
                <p className="text-white/60 text-[10px] font-bold uppercase">Old Regime</p>
                <p className="text-2xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{oldResult.total.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 space-y-1">
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Taxable</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{oldResult.taxable.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Tax</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{oldResult.tax.toLocaleString('en-IN')}</span></div>
                {oldResult.rebate > 0 && <div className="flex justify-between text-[11px]"><span className="text-green-600">Rebate 87A</span><span className="font-bold text-green-600">-₹{oldResult.rebate.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Cess 4%</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{oldResult.cess.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
            {/* New Regime */}
            <div className="rounded-2xl overflow-hidden border border-emerald-200/60">
              <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #047857, #10B981)' }}>
                <p className="text-white/60 text-[10px] font-bold uppercase">New Regime</p>
                <p className="text-2xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{newResult.total.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 space-y-1">
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Taxable</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{newResult.taxable.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Tax</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{newResult.tax.toLocaleString('en-IN')}</span></div>
                {newResult.rebate > 0 && <div className="flex justify-between text-[11px]"><span className="text-green-600">Rebate 87A</span><span className="font-bold text-green-600">-₹{newResult.rebate.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-[11px]"><span style={{ color: 'var(--c-text-muted)' }}>Cess 4%</span><span className="font-bold" style={{ color: 'var(--c-text)' }}>₹{newResult.cess.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center" style={{ color: '#C4C0B8' }}>* Approximate. Consult CA for exact tax calculation. Surcharge not included.</p>
      </div>
    </div>
  )
}
