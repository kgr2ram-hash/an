import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

const BANK_RATES = [
  { bank: 'SBI', fd: 6.5, rd: 6.5 },
  { bank: 'HDFC', fd: 7.0, rd: 7.0 },
  { bank: 'KVB', fd: 7.25, rd: 7.0 },
  { bank: 'IOB', fd: 6.8, rd: 6.5 },
  { bank: 'Post Office', fd: 7.5, rd: 6.7 },
]

function calcFD(principal, rate, years) {
  if (!principal || !rate || !years) return null
  const r = rate / 100, n = 4 // quarterly compounding
  const maturity = principal * Math.pow(1 + r / n, n * years)
  return { maturity: Math.round(maturity), interest: Math.round(maturity - principal) }
}

function calcRD(monthly, rate, months) {
  if (!monthly || !rate || !months) return null
  const r = rate / 400 // quarterly
  let maturity = 0
  for (let i = 0; i < months; i++) {
    const remaining = months - i
    maturity += monthly * Math.pow(1 + r, remaining / 3)
  }
  const totalDeposit = monthly * months
  return { maturity: Math.round(maturity), totalDeposit, interest: Math.round(maturity - totalDeposit) }
}

export default function FDRDCalculator() {
  const [tab, setTab] = useState('fd')
  const [fdAmount, setFdAmount] = useState('100000')
  const [fdRate, setFdRate] = useState('7.0')
  const [fdYears, setFdYears] = useState('3')
  const [rdAmount, setRdAmount] = useState('5000')
  const [rdRate, setRdRate] = useState('6.5')
  const [rdMonths, setRdMonths] = useState('36')

  const fdResult = calcFD(parseFloat(fdAmount), parseFloat(fdRate), parseFloat(fdYears))
  const rdResult = calcRD(parseFloat(rdAmount), parseFloat(rdRate), parseInt(rdMonths))

  const inputClass = "w-full px-3 py-3 border border-gray-200/60 rounded-xl text-sm font-bold outline-none focus:border-emerald-400 text-center"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="FD/RD Interest Calculator" description="Fixed Deposit and Recurring Deposit interest calculator with bank rates" keywords="FD calculator, RD calculator, fixed deposit, recurring deposit, interest, SBI, KVB" />
      <PageHeader title="FD / RD Calculator" subtitle="வைப்பு நிதி வட்டி கணக்கிடு - Interest Calculator" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
          <button onClick={() => setTab('fd')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'fd' ? 'bg-white shadow' : ''}`} style={{ color: tab === 'fd' ? 'var(--c-text)' : 'var(--c-text-muted)' }}>🏦 Fixed Deposit</button>
          <button onClick={() => setTab('rd')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'rd' ? 'bg-white shadow' : ''}`} style={{ color: tab === 'rd' ? 'var(--c-text)' : 'var(--c-text-muted)' }}>💰 Recurring Deposit</button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          {tab === 'fd' ? (
            <>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Deposit Amount (₹)</label>
                  <input type="number" value={fdAmount} onChange={e => setFdAmount(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Interest Rate (% p.a.)</label>
                  <input type="number" step="0.1" value={fdRate} onChange={e => setFdRate(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Period (Years)</label>
                  <input type="number" min="1" max="10" value={fdYears} onChange={e => setFdYears(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
              </div>
              {fdResult && (
                <div className="animate-fade-in">
                  <div className="text-center p-5 rounded-2xl mb-3" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                    <p className="text-white/60 text-xs font-bold uppercase">Maturity Amount</p>
                    <p className="text-white text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{fdResult.maturity.toLocaleString('en-IN')}</p>
                    <p className="text-white/50 text-xs mt-1">Interest earned: ₹{fdResult.interest.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Monthly Deposit (₹)</label>
                  <input type="number" value={rdAmount} onChange={e => setRdAmount(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Interest Rate (% p.a.)</label>
                  <input type="number" step="0.1" value={rdRate} onChange={e => setRdRate(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Period (Months)</label>
                  <select value={rdMonths} onChange={e => setRdMonths(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                    {[6,12,24,36,48,60].map(m => <option key={m} value={m}>{m} months ({m/12} yrs)</option>)}
                  </select>
                </div>
              </div>
              {rdResult && (
                <div className="animate-fade-in">
                  <div className="text-center p-5 rounded-2xl mb-3" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                    <p className="text-white/60 text-xs font-bold uppercase">Maturity Amount</p>
                    <p className="text-white text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{rdResult.maturity.toLocaleString('en-IN')}</p>
                    <p className="text-white/50 text-xs mt-1">Deposited: ₹{rdResult.totalDeposit.toLocaleString('en-IN')} • Interest: ₹{rdResult.interest.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bank Rates */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-200/60 p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--c-text-muted)' }}>Current Bank Rates (Annur)</h4>
          {BANK_RATES.map(b => (
            <div key={b.bank} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{b.bank}</span>
              <span className="text-sm font-extrabold" style={{ color: '#059669' }}>FD: {b.fd}% | RD: {b.rd}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
