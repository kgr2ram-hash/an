import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchGoldSilverPrices } from '../utils/goldPrice.js'

const REFRESH_MS = 5 * 60 * 1000

function Chg({ val, small }) {
  if (val === null || val === undefined) return null
  const pos = val >= 0
  return (
    <span className={`font-bold ${small ? 'text-[8px]' : 'text-[10px]'} ${pos ? 'text-green-300' : 'text-red-300'}`}>
      {pos ? '▲' : '▼'} {Math.abs(val).toFixed(2)}
    </span>
  )
}

export default function GoldWidget() {
  const [prices, setPrices]     = useState(null)
  const [lastUpdate, setLast]   = useState(null)
  const [refreshing, setRefr]   = useState(false)

  async function load(force = false) {
    if (force) sessionStorage.removeItem('gold_silver_v6')
    setRefr(true)
    try {
      const p = await fetchGoldSilverPrices()
      setPrices(p); setLast(new Date())
    } catch {}
    setRefr(false)
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  if (!prices) return null

  const isLive = prices.source === 'Live' || prices.source === 'Live (Direct)'

  return (
    <Link to="/gold-silver-price" className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover block">
      <div className="p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#92400E,#D97706)' }}>
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-amber-300'}`} />
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                {isLive ? 'Live' : 'Estimated'} Gold & Silver
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <span className="text-white/30 text-[8px]">
                  {lastUpdate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </span>
              )}
              <button onClick={e => { e.preventDefault(); load(true) }} disabled={refreshing}
                className="text-white/40 hover:text-white/80 text-[10px] transition-colors disabled:opacity-30"
                title="Refresh prices">
                {refreshing ? '⟳' : '🔄'}
              </button>
            </div>
          </div>

          {/* Gold + Silver row */}
          <div className="flex items-center justify-between">
            {/* Gold */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">🥇</span>
                <span className="text-white font-extrabold text-lg" style={{ fontFamily:'var(--font-display)' }}>
                  ₹{prices.gold.inr_gram_22k.toLocaleString('en-IN')}
                </span>
                <span className="text-white/40 text-[10px]">/g 22K</span>
              </div>
              <div className="flex items-center gap-2 ml-6">
                <p className="text-white/50 text-[9px]">Sovereign ₹{prices.gold.inr_8g.toLocaleString('en-IN')}</p>
                <Chg val={prices.gold.usd_chg} small />
              </div>
            </div>

            {/* Silver */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-base">🥈</span>
                <span className="text-white font-extrabold text-lg" style={{ fontFamily:'var(--font-display)' }}>
                  ₹{prices.silver.inr_gram}
                </span>
                <span className="text-white/40 text-[10px]">/g</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <p className="text-white/50 text-[9px]">1 KG ₹{prices.silver.inr_kg.toLocaleString('en-IN')}</p>
                <Chg val={prices.silver.usd_chg} small />
              </div>
            </div>
          </div>

          {/* USD/INR rate */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/40 text-[9px]">USD/INR: ₹{prices.usd_inr}</span>
            <span className="text-white/40 text-[9px]">
              Gold ${prices.gold.usd_oz}/oz • Silver ${prices.silver.usd_oz}/oz
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
