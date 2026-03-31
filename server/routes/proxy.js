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

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=11.23&longitude=77.02&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=Asia/Kolkata&forecast_days=3';
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

// ══════ GOLD & SILVER PROXY (metals.live + exchange rate) ══════
router.get('/gold-silver', async (req, res) => {
  try {
    if (goldCache.data && Date.now() - goldCache.ts < GOLD_TTL) {
      return res.json(goldCache.data);
    }

    const [metalsRes, fxRes] = await Promise.all([
      fetch('https://api.metals.live/v1/spot'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);

    const metals = await metalsRes.json();
    const fx = await fxRes.json();

    const gold = metals.find(m => m.metal === 'gold');
    const silver = metals.find(m => m.metal === 'silver');
    const usdInr = fx.rates?.INR || 85.5;

    if (!gold || !silver) {
      throw new Error('Metal prices not found');
    }

    const ozToGram = 31.1035;
    const goldIntl = (gold.price * usdInr) / ozToGram;
    const silverIntl = (silver.price * usdInr) / ozToGram;
    const indiaPremium = 1.04;
    const gold24k = Math.round(goldIntl * indiaPremium);
    const gold22k = Math.round(gold24k * 0.9167);

    const result = {
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
      source: 'Live (metals.live + er-api.com)',
      _ts: Date.now(),
    };

    goldCache = { data: result, ts: Date.now() };
    res.json(result);
  } catch (err) {
    console.error('[proxy/gold-silver] error:', err.message);
    if (goldCache.data) return res.json(goldCache.data);
    res.status(500).json({ error: 'Gold/Silver fetch failed' });
  }
});

export default router;
