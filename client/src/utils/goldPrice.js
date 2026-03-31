// Fetch live gold/silver prices via backend proxy (avoids CORS issues)
import api from '../api.js'

// Fallback rates (updated periodically)
const FALLBACK = {
  gold: {
    usd_oz: 3050,
    inr_gram_24k: 14837,
    inr_gram_22k: 13600,
    inr_gram_18k: 11128,
    inr_8g: 108800,
    inr_10g_24k: 148370,
    inr_10g_22k: 136000,
  },
  silver: {
    usd_oz: 34,
    inr_gram: 235,
    inr_100g: 23500,
    inr_kg: 235000,
  },
  usd_inr: 85.5,
  source: 'estimated (Coimbatore rates)',
  _ts: Date.now(),
}

export async function fetchGoldSilverPrices() {
  const cached = sessionStorage.getItem('gold_silver_v5')
  if (cached) {
    try {
      const c = JSON.parse(cached)
      if (Date.now() - c._ts < 300000) return c // 5 min cache
    } catch {}
  }

  let prices = null

  try {
    // Fetch from our backend proxy (handles external API calls server-side)
    const res = await api.get('/proxy/gold-silver')
    if (res.data && res.data.gold) {
      prices = res.data
    }
  } catch {
    // If backend proxy fails, try direct fetch as fallback
    try {
      const [metalsRes, fxRes] = await Promise.all([
        fetch('https://api.metals.live/v1/spot'),
        fetch('https://open.er-api.com/v6/latest/USD')
      ])
      const metals = await metalsRes.json()
      const fx = await fxRes.json()

      const gold = metals.find(m => m.metal === 'gold')
      const silver = metals.find(m => m.metal === 'silver')
      const usdInr = fx.rates?.INR || 85.5

      if (gold && silver) {
        const ozToGram = 31.1035
        const goldIntl = (gold.price * usdInr) / ozToGram
        const silverIntl = (silver.price * usdInr) / ozToGram
        const indiaPremium = 1.04
        const gold24k = Math.round(goldIntl * indiaPremium)
        const gold22k = Math.round(gold24k * 0.9167)

        prices = {
          gold: {
            usd_oz: gold.price,
            inr_gram_24k: gold24k,
            inr_gram_22k: gold22k,
            inr_gram_18k: Math.round(gold24k * 0.75),
            inr_8g: Math.round(gold22k * 8),
            inr_10g_24k: Math.round(gold24k * 10),
            inr_10g_22k: Math.round(gold22k * 10),
          },
          silver: {
            usd_oz: silver.price,
            inr_gram: Math.round(silverIntl * 2.53),
            inr_100g: Math.round(silverIntl * 2.53 * 100),
            inr_kg: Math.round(silverIntl * 2.53 * 1000),
          },
          usd_inr: Math.round(usdInr * 100) / 100,
          source: 'Live (metals.live)',
          _ts: Date.now(),
        }
      }
    } catch {}
  }

  if (!prices) prices = { ...FALLBACK, _ts: Date.now() }

  sessionStorage.setItem('gold_silver_v5', JSON.stringify(prices))
  return prices
}
