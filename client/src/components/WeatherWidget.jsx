import { useState, useEffect } from 'react'
import api from '../api.js'

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=11.23&longitude=77.02&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,uv_index,rain,cloud_cover,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=3'
const CACHE_KEY  = 'annur_weather_v5'
const CACHE_TTL  = 10 * 60 * 1000 // 10 min

function getWmoInfo(wmo, isDay = 1) {
  if (wmo === 0)  return { icon: isDay ? '☀️' : '🌙', desc: 'Clear Sky',     ta: 'தெளிவான வானம்' }
  if (wmo <= 2)   return { icon: isDay ? '⛅' : '🌤️', desc: 'Partly Cloudy', ta: 'ஓரளவு மேகமூட்டம்' }
  if (wmo === 3)  return { icon: '☁️',  desc: 'Overcast',     ta: 'மேகமூட்டம்' }
  if (wmo <= 48)  return { icon: '🌫️',  desc: 'Foggy',        ta: 'மூடுபனி' }
  if (wmo <= 57)  return { icon: '🌦️',  desc: 'Drizzle',      ta: 'தூறல்' }
  if (wmo <= 67)  return { icon: '🌧️',  desc: 'Rain',         ta: 'மழை' }
  if (wmo <= 77)  return { icon: '❄️',   desc: 'Snow',         ta: 'பனி' }
  if (wmo <= 82)  return { icon: '🌦️',  desc: 'Rain Showers', ta: 'மழைத் தூறல்' }
  if (wmo <= 86)  return { icon: '❄️',   desc: 'Snow Showers', ta: 'பனிப் பொழிவு' }
  if (wmo >= 95)  return { icon: '⛈️',  desc: 'Thunderstorm', ta: 'இடியுடன் மழை' }
  return { icon: '🌤️', desc: 'Fair', ta: 'நல்ல நிலை' }
}

function getWindDir(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8] || '—'
}

function uvLevel(uv) {
  if (uv === null || uv === undefined) return { label: '—', color: '#6B7280' }
  if (uv <= 2)  return { label: 'Low',      color: '#16A34A' }
  if (uv <= 5)  return { label: 'Moderate', color: '#CA8A04' }
  if (uv <= 7)  return { label: 'High',     color: '#EA580C' }
  if (uv <= 10) return { label: 'V-High',   color: '#DC2626' }
  return             { label: 'Extreme',    color: '#7C3AED' }
}

async function fetchWeather() {
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const c = JSON.parse(cached)
      if (Date.now() - c._ts < CACHE_TTL) return c
    } catch {}
  }
  sessionStorage.removeItem(CACHE_KEY)
  const data = await api.get('/proxy/weather').then(r => r.data).catch(() => fetch(WEATHER_URL).then(r => r.json()))
  if (!data?.current) throw new Error('No current data')

  const cur = data.current
  const info = getWmoInfo(cur.weather_code, cur.is_day)
  const curHour = new Date().getHours()

  const hourly = []
  if (data.hourly) {
    for (let i = curHour; i < curHour + 8 && i < data.hourly.time.length; i++) {
      hourly.push({
        hour: new Date(data.hourly.time[i]).getHours(),
        temp: Math.round(data.hourly.temperature_2m[i]),
        icon: getWmoInfo(data.hourly.weather_code[i]).icon,
        rain: data.hourly.precipitation_probability?.[i] ?? null,
      })
    }
  }

  const daily = []
  if (data.daily) {
    const dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    for (let i = 0; i < Math.min(3, data.daily.time.length); i++) {
      const dt = new Date(data.daily.time[i])
      const di = getWmoInfo(data.daily.weather_code[i])
      daily.push({
        day: i === 0 ? 'Today' : dn[dt.getDay()],
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
        icon: di.icon, desc: di.desc,
        sunrise: data.daily.sunrise?.[i]?.slice(11,16),
        sunset:  data.daily.sunset?.[i]?.slice(11,16),
        uvMax:   data.daily.uv_index_max?.[i] ?? null,
        rainProb: data.daily.precipitation_probability_max?.[i] ?? null,
      })
    }
  }

  const result = {
    temp:      Math.round(cur.temperature_2m),
    feels:     Math.round(cur.apparent_temperature),
    humidity:  cur.relative_humidity_2m,
    wind:      Math.round(cur.wind_speed_10m),
    windDir:   getWindDir(cur.wind_direction_10m),
    uv:        cur.uv_index ?? null,
    rain:      cur.rain ?? 0,
    cloud:     cur.cloud_cover ?? null,
    isDay:     cur.is_day,
    ...info, hourly, daily, _ts: Date.now(),
  }
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
  return result
}

// ── Compact hero widget ──────────────────────────────────────────
export default function WeatherWidget() {
  const [w, setW] = useState(null)

  useEffect(() => {
    fetchWeather().then(setW).catch(() => {})
    const timer = setInterval(() => {
      sessionStorage.removeItem(CACHE_KEY)
      fetchWeather().then(setW).catch(() => {})
    }, CACHE_TTL)
    return () => clearInterval(timer)
  }, [])

  if (!w) return null

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3.5 py-2.5">
      <span className="text-3xl">{w.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-xl">{w.temp}°</span>
          <span className="text-white/50 text-xs">C</span>
          <span className="text-white/40 text-[10px] ml-1">Feels {w.feels}°</span>
        </div>
        <span className="text-white/60 text-[10px] font-medium">{w.desc} • {w.ta}</span>
      </div>
      <div className="text-right shrink-0">
        <div className="text-white/70 text-[10px] font-bold">💧{w.humidity}%</div>
        <div className="text-white/70 text-[10px] font-bold">💨{w.wind}km/h</div>
        {w.uv !== null && <div className="text-[10px] font-bold" style={{ color: uvLevel(w.uv).color }}>UV {w.uv}</div>}
      </div>
    </div>
  )
}

// ── Full weather card for home page ─────────────────────────────
export function WeatherCard() {
  const [w, setW]               = useState(null)
  const [lastUpdate, setLast]   = useState(null)
  const [refreshing, setRefr]   = useState(false)

  const load = async (forceRefresh = false) => {
    if (forceRefresh) sessionStorage.removeItem(CACHE_KEY)
    setRefr(true)
    try {
      const data = await fetchWeather()
      setW(data); setLast(new Date(data._ts))
    } catch {}
    setRefr(false)
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), CACHE_TTL)
    return () => clearInterval(timer)
  }, [])

  if (!w) return (
    <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden animate-pulse">
      <div className="h-40 bg-gradient-to-br from-sky-200 to-blue-300" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )

  const uv = uvLevel(w.uv)

  return (
    <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover">

      {/* Main current weather */}
      <div className="p-5 relative overflow-hidden" style={{ background: w.isDay ? 'linear-gradient(135deg,#0369A1,#0EA5E9)' : 'linear-gradient(135deg,#1E3A5F,#1E40AF)' }}>
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Annur Weather</p>
                {lastUpdate && (
                  <button onClick={() => load(true)} disabled={refreshing}
                    className="text-white/30 text-[9px] hover:text-white/60 transition-colors disabled:opacity-50">
                    {refreshing ? '⟳' : `🔄 ${lastUpdate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`}
                  </button>
                )}
              </div>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-5xl font-extrabold text-white" style={{ fontFamily:'var(--font-display)' }}>{w.temp}°</span>
                <div className="mb-1">
                  <span className="text-white/50 text-sm">C</span>
                  <p className="text-white/60 text-xs">Feels {w.feels}°</p>
                </div>
              </div>
              <p className="text-white/90 text-sm font-bold">{w.desc}</p>
              <p className="text-white/50 text-[11px]">{w.ta}</p>
            </div>
            <span className="text-6xl">{w.icon}</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { icon:'💧', label:'Humidity',  val:`${w.humidity}%` },
              { icon:'💨', label:`Wind ${w.windDir}`, val:`${w.wind}km/h` },
              { icon:'☁️', label:'Cloud',     val: w.cloud !== null ? `${w.cloud}%` : '—' },
              { icon:'🌧️', label:'Rain',      val: w.rain > 0 ? `${w.rain}mm` : 'Nil' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-2 py-1.5 text-center">
                <span className="text-base">{s.icon}</span>
                <p className="text-white font-extrabold text-xs mt-0.5">{s.val}</p>
                <p className="text-white/50 text-[8px]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* UV Index bar */}
          {w.uv !== null && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-white/60 text-[10px] font-bold">UV Index:</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.15)' }}>
                <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(w.uv/12*100,100)}%`, background: uv.color }} />
              </div>
              <span className="text-[10px] font-extrabold" style={{ color: uv.color === '#16A34A' ? '#86EFAC' : uv.color }}>{w.uv} — {uv.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hourly forecast */}
      {w.hourly?.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color:'var(--c-text-muted)' }}>Next 8 Hours</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {w.hourly.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 shrink-0 min-w-[48px] bg-gray-50 rounded-xl py-2 px-1 text-center">
                <span className="text-[9px] font-bold" style={{ color:'var(--c-text-muted)' }}>{i===0?'Now':`${h.hour}:00`}</span>
                <span className="text-lg">{h.icon}</span>
                <span className="text-xs font-extrabold" style={{ color:'var(--c-text)' }}>{h.temp}°</span>
                {h.rain !== null && (
                  <span className="text-[8px] font-bold text-blue-500">{h.rain}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-day forecast */}
      {w.daily?.length > 0 && (
        <div className="px-5 py-3">
          <p className="text-[10px] font-black uppercase tracking-wider mb-2.5" style={{ color:'var(--c-text-muted)' }}>3-Day Forecast</p>
          <div className="space-y-2.5">
            {w.daily.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold w-10 shrink-0" style={{ color: i===0?'var(--c-primary)':'var(--c-text-muted)' }}>{d.day}</span>
                <span className="text-lg">{d.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color:'var(--c-text-muted)' }}>{d.min}°</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        background:'linear-gradient(to right,#0EA5E9,#F59E0B)',
                        marginLeft:`${Math.max(0,(d.min-15)/30*100)}%`,
                        width:`${Math.min(100,(d.max-d.min)/30*100)}%`,
                      }} />
                    </div>
                    <span className="text-xs font-extrabold" style={{ color:'var(--c-text)' }}>{d.max}°</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {d.rainProb !== null && (
                    <span className="text-[9px] font-bold text-blue-500">🌧️{d.rainProb}%</span>
                  )}
                  {d.uvMax !== null && (
                    <span className="text-[9px] font-bold" style={{ color: uvLevel(d.uvMax).color }}>UV{d.uvMax}</span>
                  )}
                </div>
                {d.sunrise && (
                  <span className="text-[9px] font-bold hidden sm:block" style={{ color:'#C4C0B8' }}>
                    🌅{d.sunrise} 🌇{d.sunset}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-2 border-t border-gray-100 flex items-center justify-between" style={{ background:'#F8F7F4' }}>
        <span className="text-[9px]" style={{ color:'var(--c-text-muted)' }}>📍 Annur, Tamil Nadu (11.23°N 77.02°E)</span>
        <span className="text-[9px]" style={{ color:'var(--c-text-muted)' }}>Source: Open-Meteo</span>
      </div>
    </div>
  )
}
