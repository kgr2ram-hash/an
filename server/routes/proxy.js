import { Router } from 'express';

const router = Router();

// Cache to avoid hitting external APIs too frequently
let weatherCache = { data: null, ts: 0 };
let goldCache = { data: null, ts: 0 };

const WEATHER_TTL = 10 * 60 * 1000; // 10 minutes
const GOLD_TTL = 5 * 60 * 1000;     // 5 minutes

// ══════ WEATHER PROXY (Open-Meteo) ══════
router.get('/weather', async (req, res) => {
  try {
    if (weatherCache.data && Date.now() - weatherCache.ts < WEATHER_TTL) {
      return res.json(weatherCache.data);
    }

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=11.23&longitude=77.02&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,uv_index,rain,cloud_cover,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=3';
    const response = await fetch(url);
    const data = await response.json();

    weatherCache = { data, ts: Date.now() };
    res.json(data);
  } catch (err) {
    console.error('[proxy/weather] error:', err.message);
    if (weatherCache.data) return res.json(weatherCache.data);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// ══════ GOLD & SILVER PROXY (multi-source) ══════
router.get('/gold-silver', async (req, res) => {
  try {
    if (goldCache.data && Date.now() - goldCache.ts < GOLD_TTL) {
      return res.json(goldCache.data);
    }

    let goldUsd = null, silverUsd = null, goldChg = null, silverChg = null;
    const ua = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };

    // Source 1: goldprice.org data feed (free, no key, gold-specific)
    try {
      const gp = await fetch('https://data-asg.goldprice.org/dbXRates/USD', { headers: ua });
      const gpData = await gp.json();
      const item = gpData.items?.[0];
      if (item?.xauPrice && item?.xagPrice) {
        goldUsd   = item.xauPrice;
        silverUsd = item.xagPrice;
        goldChg   = item.chgXau ?? null;
        silverChg = item.chgXag ?? null;
        console.log('[proxy/gold-silver] source: goldprice.org');
      }
    } catch (e) { console.warn('[proxy/gold-silver] goldprice.org failed:', e.message); }

    // Source 2: Yahoo Finance fallback
    if (!goldUsd || !silverUsd) {
      try {
        const [gr, sr] = await Promise.all([
          fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1d', { headers: ua }),
          fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d', { headers: ua }),
        ]);
        const gd = await gr.json(), sd = await sr.json();
        goldUsd   = gd.chart?.result?.[0]?.meta?.regularMarketPrice;
        silverUsd = sd.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (goldUsd && silverUsd) console.log('[proxy/gold-silver] source: Yahoo Finance');
      } catch (e) { console.warn('[proxy/gold-silver] Yahoo Finance failed:', e.message); }
    }

    if (!goldUsd || !silverUsd) throw new Error('All metal price sources failed');

    // USD/INR exchange rate
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', { headers: ua });
    const fx = await fxRes.json();
    const usdInr = fx.rates?.INR || 84.0;

    const OZ = 31.1035, PREMIUM = 1.04;
    const gold24k = Math.round((goldUsd * usdInr / OZ) * PREMIUM);
    const gold22k = Math.round(gold24k * 0.9167);
    const silverInrGram = Math.round((silverUsd * usdInr / OZ) * PREMIUM);

    const result = {
      gold: {
        usd_oz:       Math.round(goldUsd * 100) / 100,
        usd_chg:      goldChg !== null ? Math.round(goldChg * 100) / 100 : null,
        inr_gram_24k: gold24k,
        inr_gram_22k: gold22k,
        inr_gram_18k: Math.round(gold24k * 0.75),
        inr_8g:       Math.round(gold22k * 8),
        inr_10g_24k:  Math.round(gold24k * 10),
        inr_10g_22k:  Math.round(gold22k * 10),
      },
      silver: {
        usd_oz:   Math.round(silverUsd * 100) / 100,
        usd_chg:  silverChg !== null ? Math.round(silverChg * 100) / 100 : null,
        inr_gram: silverInrGram,
        inr_100g: silverInrGram * 100,
        inr_kg:   silverInrGram * 1000,
      },
      usd_inr: Math.round(usdInr * 100) / 100,
      source:  'Live',
      _ts:     Date.now(),
    };

    goldCache = { data: result, ts: Date.now() };
    res.json(result);
  } catch (err) {
    console.error('[proxy/gold-silver] error:', err.message);
    if (goldCache.data) return res.json({ ...goldCache.data, source: 'Cached' });
    res.status(500).json({ error: 'Gold/Silver fetch failed' });
  }
});

// ══════ SPORTS PROXY (local events only — IPL data is hardcoded client-side) ══════
router.get('/sports', async (req, res) => {
  res.json({ ipl: { upcoming: [], past: [] }, _ts: Date.now() })
})

export default router;
