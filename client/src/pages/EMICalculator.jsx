import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

const LOAN_PRESETS = [
  { label: 'Home Loan', icon: '🏠', amount: 2000000, rate: 8.5, years: 20 },
  { label: 'Car Loan', icon: '🚗', amount: 800000, rate: 9.5, years: 5 },
  { label: 'Bike Loan', icon: '🏍️', amount: 100000, rate: 12, years: 3 },
  { label: 'Personal', icon: '💰', amount: 500000, rate: 14, years: 3 },
  { label: 'Education', icon: '🎓', amount: 1000000, rate: 8, years: 7 },
  { label: 'Gold Loan', icon: '🥇', amount: 300000, rate: 7.5, years: 2 },
]

function calcEMI(principal, annualRate, years) {
  if (!principal || !annualRate || !years) return null
  const P = principal, r = annualRate / 12 / 100, n = years * 12
  if (r === 0) return { emi: P / n, totalPayment: P, totalInterest: 0, months: n }
  const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const totalPayment = emi * n
  return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - P), months: n }
}

export default function EMICalculator() {
  const [amount, setAmount] = useState('2000000')
  const [rate, setRate] = useState('8.5')
  const [years, setYears] = useState('20')

  const result = calcEMI(parseFloat(amount), parseFloat(rate), parseFloat(years))
  const principalPct = result ? Math.round((parseFloat(amount) / result.totalPayment) * 100) : 0
  const interestPct = 100 - principalPct

  const inputClass = "w-full px-3 py-3 border border-gray-200/60 rounded-xl text-sm font-bold outline-none focus:border-blue-400 text-center"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Loan EMI Calculator" description="Calculate EMI for home loan, car loan, personal loan. Monthly payment calculator." keywords="EMI calculator, home loan, car loan, personal loan, Annur, Coimbatore" />
      <PageHeader title="Loan EMI Calculator" subtitle="கடன் EMI கணக்கிடு - Monthly Payment Calculator" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Presets */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {LOAN_PRESETS.map(p => (
            <button key={p.label} onClick={() => { setAmount(String(p.amount)); setRate(String(p.rate)); setYears(String(p.years)) }}
              className="shrink-0 px-4 py-2.5 bg-white rounded-xl border border-gray-200/60 text-xs font-bold hover:border-blue-300 transition-colors" style={{ color: 'var(--c-text-muted)' }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>🏦</div>
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>EMI Calculator</h3>
              <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Equated Monthly Installment</p>
            </div>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Loan Amount (₹)</label>
                <span className="text-xs font-extrabold" style={{ color: 'var(--c-primary)' }}>₹{parseFloat(amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="50000" max="10000000" step="50000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full accent-blue-600" />
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Interest Rate (% p.a.)</label>
                <span className="text-xs font-extrabold" style={{ color: 'var(--c-primary)' }}>{rate}%</span>
              </div>
              <input type="range" min="1" max="30" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full accent-blue-600" />
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Tenure (Years)</label>
                <span className="text-xs font-extrabold" style={{ color: 'var(--c-primary)' }}>{years} yrs ({parseFloat(years) * 12} months)</span>
              </div>
              <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(e.target.value)} className="w-full accent-blue-600" />
            </div>
          </div>

          {result && (
            <div className="animate-fade-in">
              <div className="text-center p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' }}>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Monthly EMI</p>
                <p className="text-white text-4xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{result.emi.toLocaleString('en-IN')}</p>
                <p className="text-white/40 text-xs mt-1">for {result.months} months</p>
              </div>

              {/* Donut visual */}
              <div className="flex items-center gap-6 p-4 rounded-2xl mb-3" style={{ background: '#F8F7F4' }}>
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle r="16" cx="18" cy="18" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={`${principalPct} ${interestPct}`} />
                    <circle r="16" cx="18" cy="18" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray={`${interestPct} ${principalPct}`} strokeDashoffset={`${-principalPct}`} />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500" /><span className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Principal: ₹{parseFloat(amount).toLocaleString('en-IN')} ({principalPct}%)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500" /><span className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Interest: ₹{result.totalInterest.toLocaleString('en-IN')} ({interestPct}%)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-400" /><span className="text-xs font-bold" style={{ color: 'var(--c-text)' }}>Total: ₹{result.totalPayment.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
