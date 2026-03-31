import { useState, useEffect } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { fetchGoldSilverPrices } from '../utils/goldPrice.js'

// Legacy wrapper
async function fetchPrices() {
  const p = await fetchGoldSilverPrices()
  // Map to old format for compatibility
  return {
    gold: { usd_oz: p.gold.usd_oz, inr_gram: p.gold.inr_gram_24k, inr_gram_22k: p.gold.inr_gram_22k, inr_8g: p.gold.inr_8g, inr_10g: p.gold.inr_10g_24k, inr_sovereign: p.gold.inr_8g },
    silver: { usd_oz: p.silver.usd_oz, inr_gram: p.silver.inr_gram, inr_100g: p.silver.inr_100g, inr_kg: p.silver.inr_kg },
    source: p.source, ts: p._ts, usd_inr: p.usd_inr,
  }
}

// Old code removed - uses shared utility above

function PriceCard({ metal, icon, color, data, unit, amount, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>{label}</span>
        </div>
      </div>
      <p className="text-2xl font-extrabold mt-2" style={{ color, fontFamily: 'var(--font-display)' }}>₹{amount?.toLocaleString('en-IN')}</p>
      <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>{unit}</p>
    </div>
  )
}

export default function GoldSilverPrice() {
  const [prices, setPrices] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calcType, setCalcType] = useState('gold')
  const [calcWeight, setCalcWeight] = useState('')
  const [calcPurity, setCalcPurity] = useState('24')

  useEffect(() => {
    fetchPrices().then(p => setPrices(p)).finally(() => setLoading(false))
  }, [])

  const purityFactor = { '24': 1, '22': 0.9167, '18': 0.75 }
  const calcResult = prices && calcWeight ? (() => {
    const w = parseFloat(calcWeight) || 0
    if (w <= 0) return null
    if (calcType === 'gold') {
      const pricePerGram = prices.gold.inr_gram * (purityFactor[calcPurity] || 1)
      return { total: Math.round(pricePerGram * w), perGram: Math.round(pricePerGram), weight: w }
    } else {
      return { total: Math.round(prices.silver.inr_gram * w), perGram: prices.silver.inr_gram, weight: w }
    }
  })() : null

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--c-surface)' }}>
        <PageHeader title="Gold & Silver Price" subtitle="Loading live prices..." />
        <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12">
          <div className="skeleton h-48 rounded-3xl" />
          <div className="skeleton h-48 rounded-3xl mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Gold & Silver Price Today" description="Live gold and silver price in Annur, Coimbatore. Today's 22K, 24K gold rate and silver rate per gram." keywords="gold price Annur, silver price, today gold rate Coimbatore, 22K gold, 24K gold, silver rate" />
      <PageHeader title="Gold & Silver Price" subtitle="Today's live rate in Annur, Coimbatore" />

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-12">

        {/* Gold Section */}
        <div className="rounded-3xl overflow-hidden mb-5 shadow-sm">
          <div className="p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🥇</span>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Gold / தங்கம்</p>
                    <p className="text-3xl font-extrabold mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>₹{prices.gold.inr_10g.toLocaleString('en-IN')}</p>
                    <p className="text-white/60 text-xs">per 10 grams (24K)</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px]">International</p>
                <p className="text-white font-bold text-sm">${prices.gold.usd_oz}/oz</p>
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-3 gap-0 border-t border-gray-100">
            <div className="p-3 border-r border-gray-100 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>24K / 1 gram</p>
              <p className="text-sm font-extrabold" style={{ color: '#B45309' }}>₹{prices.gold.inr_gram.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 border-r border-gray-100 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>22K / 1 gram</p>
              <p className="text-sm font-extrabold" style={{ color: '#B45309' }}>₹{(prices.gold.inr_gram_22k || Math.round(prices.gold.inr_gram * 0.9167)).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>1 Sovereign (8g)</p>
              <p className="text-sm font-extrabold" style={{ color: '#B45309' }}>₹{prices.gold.inr_sovereign.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Silver Section */}
        <div className="rounded-3xl overflow-hidden mb-5 shadow-sm">
          <div className="p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #475569, #94A3B8)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🥈</span>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Silver / வெள்ளி</p>
                    <p className="text-3xl font-extrabold mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>₹{prices.silver.inr_kg.toLocaleString('en-IN')}</p>
                    <p className="text-white/60 text-xs">per 1 KG</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px]">International</p>
                <p className="text-white font-bold text-sm">${prices.silver.usd_oz}/oz</p>
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-3 gap-0 border-t border-gray-100">
            <div className="p-3 border-r border-gray-100 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>1 gram</p>
              <p className="text-sm font-extrabold" style={{ color: '#475569' }}>₹{prices.silver.inr_gram.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 border-r border-gray-100 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>100 grams</p>
              <p className="text-sm font-extrabold" style={{ color: '#475569' }}>₹{prices.silver.inr_100g.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>1 KG</p>
              <p className="text-sm font-extrabold" style={{ color: '#475569' }}>₹{prices.silver.inr_kg.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Price Calculator */}
        <div className="bg-white rounded-3xl border border-gray-200/60 p-5 mb-5">
          <h3 className="font-extrabold text-sm mb-4" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>💰 Price Calculator / விலை கணக்கிடு</h3>
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
              <input type="number" min="0" step="0.1" value={calcWeight} onChange={e => setCalcWeight(e.target.value)} placeholder="e.g. 10"
                className="w-full px-3 py-2.5 border border-gray-200/60 rounded-xl text-sm font-bold outline-none text-center" style={{ background: '#F8F7F4' }} />
            </div>
          </div>
          {calcResult && (
            <div className="p-4 rounded-2xl animate-fade-in text-center" style={{ background: calcType === 'gold' ? 'linear-gradient(135deg, #B45309, #F59E0B)' : 'linear-gradient(135deg, #475569, #94A3B8)' }}>
              <p className="text-white/60 text-xs font-bold">
                {calcResult.weight}g {calcType === 'gold' ? `${calcPurity}K Gold` : 'Silver'} @ ₹{calcResult.perGram}/g
              </p>
              <p className="text-white text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{calcResult.total.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F7F4' }}>
          <span className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>
            Source: {prices.source === 'metals.live' ? 'Live market data' : 'Estimated rates'} • Updated: {new Date(prices.ts).toLocaleTimeString()}
          </span>
          <button onClick={() => { sessionStorage.removeItem('gold_silver_v5'); sessionStorage.removeItem('gold_silver_v4'); sessionStorage.removeItem('gold_silver_prices'); window.location.reload() }}
            className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ color: 'var(--c-primary)', background: 'rgba(12,74,62,0.06)' }}>
            🔄 Refresh
          </button>
        </div>

        <p className="text-[10px] text-center mt-3" style={{ color: '#C4C0B8' }}>
          * Prices are indicative. Actual jewellery prices include making charges (8-25%). Visit local jewellers for exact rates.
        </p>
      </div>
    </div>
  )
}
