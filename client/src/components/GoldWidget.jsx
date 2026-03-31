import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchGoldSilverPrices } from '../utils/goldPrice.js'

const REFRESH_MS = 5 * 60 * 1000 // 5 minutes

export default function GoldWidget() {
  const [prices, setPrices] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  function refresh() {
    sessionStorage.removeItem('gold_silver_v5') // force fresh fetch
    fetchGoldSilverPrices().then(p => {
      setPrices(p)
      setLastUpdate(new Date())
    }).catch(() => {})
  }

  useEffect(() => {
    fetchGoldSilverPrices().then(p => { setPrices(p); setLastUpdate(new Date()) }).catch(() => {})
    const timer = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  if (!prices) return null

  return (
    <Link to="/gold-silver-price" className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover block">
      <div className="p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #92400E, #D97706)' }}>
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Live Gold & Silver</p>
            <div className="flex items-center gap-1.5">
              {lastUpdate && <span className="text-white/30 text-[8px]">{lastUpdate.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>}
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">🥇</span>
                <span className="text-white font-extrabold text-lg" style={{ fontFamily: 'var(--font-display)' }}>₹{prices.gold.inr_gram_22k.toLocaleString('en-IN')}</span>
                <span className="text-white/40 text-[10px]">/g 22K</span>
              </div>
              <p className="text-white/50 text-[10px] ml-6">1 Sovereign: ₹{prices.gold.inr_8g.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-base">🥈</span>
                <span className="text-white font-extrabold text-lg" style={{ fontFamily: 'var(--font-display)' }}>₹{prices.silver.inr_gram}</span>
                <span className="text-white/40 text-[10px]">/g</span>
              </div>
              <p className="text-white/50 text-[10px]">1 KG: ₹{prices.silver.inr_kg.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
