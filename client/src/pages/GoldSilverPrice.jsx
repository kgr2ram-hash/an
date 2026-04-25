import { useState, useEffect } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { fetchGoldSilverPrices } from '../utils/goldPrice.js'

function Chg({ val, prefix = '' }) {
  if (val === null || val === undefined) return null
  const pos = val >= 0
  return (
    <span className={`text-xs font-bold ${pos ? 'text-green-500' : 'text-red-500'}`}>
      {prefix}{pos ? '▲' : '▼'} {Math.abs(val).toFixed(2)}
    </span>
  )
}

export default function GoldSilverPrice() {
  const [raw, setRaw]           = useState(null)
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefr]   = useState(false)
  const [lastUpdate, setLast]   = useState(null)
  const [calcType, setCalcType] = useState('gold')
  const [calcWeight, setCalcWeight] = useState('')
  const [calcPurity, setCalcPurity] = useState('22')

  async function load(force = false) {
    if (force) sessionStorage.removeItem('gold_silver_v6')
    setRefr(true)
    try {
      const p = await fetchGoldSilverPrices()
      setRaw(p); setLast(new Date())
    } catch {}
    setRefr(false)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const isLive = raw?.source === 'Live' || raw?.source === 'Live (Direct)'

  const purityFactor = { '24': 1, '22': 0.9167, '18': 0.75 }
  const calcResult = raw && calcWeight ? (() => {
    const w = parseFloat(calcWeight) || 0
    if (w <= 0) return null
    if (calcType === 'gold') {
      const base = calcPurity === '24' ? raw.gold.inr_gram_24k : calcPurity === '22' ? raw.gold.inr_gram_22k : raw.gold.inr_gram_18k
      return { total: Math.round(base * w), perGram: base, weight: w }
    }
    return { total: Math.round(raw.silver.inr_gram * w), perGram: raw.silver.inr_gram, weight: w }
  })() : null

  if (loading) return (
    <div className="min-h-screen" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title="Gold & Silver Price" subtitle="Loading live prices..." />
      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="skeleton h-48 rounded-3xl" />
        <div className="skeleton h-48 rounded-3xl mt-4" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Gold & Silver Price Today" description="Live gold and silver price in Annur, Coimbatore. Today's 22K, 24K gold rate and silver rate per gram." keywords="gold price Annur, silver price, today gold rate Coimbatore, 22K gold, 24K gold, silver rate" />
      <PageHeader title="Gold & Silver Price" subtitle="Today's live rate — Annur, Coimbatore" />

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12 space-y-4">

        {/* Live / Source bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-bold" style={{ color: isLive ? '#16A34A' : '#D97706' }}>
              {isLive ? '🟢 Live Price' : '🟡 Estimated Price'}
            </span>
            {raw?.usd_inr && (
              <span className="text-[10px] text-gray-400 ml-2">USD/INR: ₹{raw.usd_inr}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-[10px] text-gray-400">
                Updated {lastUpdate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
              </span>
            )}
            <button onClick={() => load(true)} disabled={refreshing}
              className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-40"
              style={{ background: 'rgba(12,74,62,0.07)', color: 'var(--c-primary)' }}>
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Gold section */}
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#B45309,#F59E0B)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🥇</span>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Gold / தங்கம்</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                        ₹{raw.gold.inr_10g_24k.toLocaleString('en-IN')}
                      </p>
                      <Chg val={raw.gold.usd_chg ? raw.gold.usd_chg * raw.usd_inr / 31.1035 : null} />
                    </div>
                    <p className="text-white/60 text-xs">per 10 grams (24K)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px]">International</p>
                  <p className="text-white font-bold text-sm">${raw.gold.usd_oz}/oz</p>
                  <Chg val={raw.gold.usd_chg} prefix="$" />
                </div>
              </div>
            </div>
          </div>

          {/* Gold breakdown */}
          <div className="bg-white grid grid-cols-3 gap-0 border-t border-gray-100">
            {[
              { label: '24K / 1 gram',     val: raw.gold.inr_gram_24k },
              { label: '22K / 1 gram',     val: raw.gold.inr_gram_22k },
              { label: '1 Sovereign (8g)', val: raw.gold.inr_8g },
            ].map((item, i) => (
              <div key={i} className={`p-3 text-center ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>{item.label}</p>
                <p className="text-sm font-extrabold mt-0.5" style={{ color: '#B45309' }}>
                  ₹{item.val.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Extra gold rates */}
          <div className="bg-amber-50 grid grid-cols-2 border-t border-amber-100">
            {[
              { label: '10g — 18K', val: raw.gold.inr_gram_18k * 10 },
              { label: '10g — 22K', val: raw.gold.inr_10g_22k },
            ].map((item, i) => (
              <div key={i} className={`p-2.5 text-center ${i === 0 ? 'border-r border-amber-100' : ''}`}>
                <p className="text-[9px] font-bold text-amber-700">{item.label}</p>
                <p className="text-xs font-extrabold text-amber-900">₹{item.val.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Silver section */}
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#475569,#94A3B8)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🥈</span>
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Silver / வெள்ளி</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                      ₹{raw.silver.inr_kg.toLocaleString('en-IN')}
                    </p>
                    <Chg val={raw.silver.usd_chg ? raw.silver.usd_chg * raw.usd_inr / 31.1035 : null} />
                  </div>
                  <p className="text-white/60 text-xs">per 1 KG</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px]">International</p>
                <p className="text-white font-bold text-sm">${raw.silver.usd_oz}/oz</p>
                <Chg val={raw.silver.usd_chg} prefix="$" />
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-3 gap-0 border-t border-gray-100">
            {[
              { label: '1 gram',   val: raw.silver.inr_gram },
              { label: '100 grams',val: raw.silver.inr_100g },
              { label: '1 KG',     val: raw.silver.inr_kg },
            ].map((item, i) => (
              <div key={i} className={`p-3 text-center ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>{item.label}</p>
                <p className="text-sm font-extrabold mt-0.5" style={{ color: '#475569' }}>
                  ₹{item.val.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-5">
          <h3 className="font-extrabold text-sm mb-4" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
            💰 Price Calculator / விலை கணக்கிடு
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-bold mb-1" style={{ color: 'var(--c-text-muted)' }}>Metal</label>
              <select value={calcType} onChange={e => setCalcType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm font-bold outline-none" style={{ background: '#F8F7F4' }}>
                <option value="gold">🥇 Gold</option>
                <option value="silver">🥈 Silver</option>
              </select>
            </div>
            {calcType === 'gold' && (
              <div>
                <label className="block text-[10px] font-bold mb-1" style={{ color: 'var(--c-text-muted)' }}>Purity</label>
                <select value={calcPurity} onChange={e => setCalcPurity(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm font-bold outline-none" style={{ background: '#F8F7F4' }}>
                  <option value="24">24K (99.9%)</option>
                  <option value="22">22K (91.6%)</option>
                  <option value="18">18K (75%)</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold mb-1" style={{ color: 'var(--c-text-muted)' }}>Weight (grams)</label>
              <input type="number" min="0" step="0.1" value={calcWeight} onChange={e => setCalcWeight(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm font-bold outline-none text-center" style={{ background: '#F8F7F4' }} />
            </div>
          </div>
          {calcResult && (
            <div className="p-4 rounded-2xl animate-fade-in text-center"
              style={{ background: calcType === 'gold' ? 'linear-gradient(135deg,#B45309,#F59E0B)' : 'linear-gradient(135deg,#475569,#94A3B8)' }}>
              <p className="text-white/60 text-xs font-bold">
                {calcResult.weight}g {calcType === 'gold' ? `${calcPurity}K Gold` : 'Silver'} @ ₹{calcResult.perGram.toLocaleString('en-IN')}/g
              </p>
              <p className="text-white text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                ₹{calcResult.total.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center" style={{ color: '#C4C0B8' }}>
          * Prices are indicative. Actual jewellery prices include making charges (8–25%). Visit local jewellers for exact rates.
          <br />Source: {isLive ? 'goldprice.org / Open Exchange Rates' : 'Estimated market rates'} • {raw?.usd_inr && `USD/INR ₹${raw.usd_inr}`}
        </p>
      </div>
    </div>
  )
}
