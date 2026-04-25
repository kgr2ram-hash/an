import api from '../api.js'

const CACHE_KEY = 'gold_silver_v6'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Fallback static rates (Coimbatore market estimates)
const FALLBACK = {
  gold: {
    usd_oz: 3320,
    usd_chg: null,
    inr_gram_24k: 10940,
    inr_gram_22k: 10028,
    inr_gram_18k: 8205,
    inr_8g: 80224,
    inr_10g_24k: 109400,
    inr_10g_22k: 100280,
  },
  silver: {
    usd_oz: 33,
    usd_chg: null,
    inr_gram: 113,
    inr_100g: 11300,
    inr_kg: 113000,
  },
  usd_inr: 84.0,
  source: 'Estimated',
  _ts: Date.now(),
}

export async function fetchGoldSilverPrices() {
  // Check cache
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const c = JSON.parse(cached)
      if (Date.now() - c._ts < CACHE_TTL) return c
    } catch {}
  }

  let prices = null

  // Try backend proxy (handles multi-source fetch server-side)
  try {
    const res = await api.get('/proxy/gold-silver')
    if (res.data?.gold?.inr_gram_22k) {
      prices = res.data
    }
  } catch {}

  // Client-side fallback: goldprice.org + er-api.com
  if (!prices) {
    try {
      const [gpRes, fxRes] = await Promise.all([
        fetch('https://data-asg.goldprice.org/dbXRates/USD'),
        fetch('https://open.er-api.com/v6/latest/USD'),
      ])
      const gp = await gpRes.json()
      const fx = await fxRes.json()
      const item = gp.items?.[0]
      const usdInr = fx.rates?.INR || 84.0
      if (item?.xauPrice && item?.xagPrice) {
        const OZ = 31.1035, P = 1.04
        const gold24k = Math.round((item.xauPrice * usdInr / OZ) * P)
        const gold22k = Math.round(gold24k * 0.9167)
        const silverInrGram = Math.round((item.xagPrice * usdInr / OZ) * P)
        prices = {
          gold: {
            usd_oz: Math.round(item.xauPrice * 100) / 100,
            usd_chg: item.chgXau ?? null,
            inr_gram_24k: gold24k,
            inr_gram_22k: gold22k,
            inr_gram_18k: Math.round(gold24k * 0.75),
            inr_8g: Math.round(gold22k * 8),
            inr_10g_24k: Math.round(gold24k * 10),
            inr_10g_22k: Math.round(gold22k * 10),
          },
          silver: {
            usd_oz: Math.round(item.xagPrice * 100) / 100,
            usd_chg: item.chgXag ?? null,
            inr_gram: silverInrGram,
            inr_100g: silverInrGram * 100,
            inr_kg: silverInrGram * 1000,
          },
          usd_inr: Math.round(usdInr * 100) / 100,
          source: 'Live (Direct)',
          _ts: Date.now(),
        }
      }
    } catch {}
  }

  if (!prices) prices = { ...FALLBACK, _ts: Date.now() }

  sessionStorage.setItem(CACHE_KEY, JSON.stringify(prices))
  return prices
}
