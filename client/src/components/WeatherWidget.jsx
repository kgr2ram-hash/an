import { useState, useEffect } from 'react'
import api from '../api.js'

function getWmoInfo(wmo) {
  if (wmo === 0) return { icon: '☀️', desc: 'Clear Sky', ta: 'தெளிவான வானம்' }
  if (wmo <= 2) return { icon: '⛅', desc: 'Partly Cloudy', ta: 'ஓரளவு மேகமூட்டம்' }
  if (wmo === 3) return { icon: '☁️', desc: 'Overcast', ta: 'மேகமூட்டம்' }
  if (wmo <= 48) return { icon: '🌫️', desc: 'Foggy', ta: 'மூடுபனி' }
  if (wmo <= 57) return { icon: '🌧️', desc: 'Drizzle', ta: 'தூறல்' }
  if (wmo <= 67) return { icon: '🌧️', desc: 'Rain', ta: 'மழை' }
  if (wmo <= 77) return { icon: '❄️', desc: 'Snow', ta: 'பனி' }
  if (wmo <= 82) return { icon: '🌦️', desc: 'Rain Showers', ta: 'மழைத் தூறல்' }
  if (wmo <= 86) return { icon: '❄️', desc: 'Snow Showers', ta: 'பனிப் பொழிவு' }
  if (wmo >= 95) return { icon: '⛈️', desc: 'Thunderstorm', ta: 'இடியுடன் மழை' }
  return { icon: '🌤️', desc: 'Fair', ta: 'நல்ல நிலை' }
}

// Compact version for hero banner
export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    function doFetch() {
      const cached = sessionStorage.getItem('annur_weather_v3')
      if (cached) {
        try {
          const c = JSON.parse(cached)
          if (Date.now() - c._ts < 600000) { setWeather(c); return } // 10 min cache
        } catch {}
      }
      // Try backend proxy first, then direct fetch as fallback
      api.get('/proxy/weather')
        .then(res => res.data)
        .catch(() => fetch('https://api.open-meteo.com/v1/forecast?latitude=11.23&longitude=77.02&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Asia/Kolkata').then(r => r.json()))
        .then(data => {
          if (data.current) {
            const info = getWmoInfo(data.current.weather_code)
            const w = { temp: Math.round(data.current.temperature_2m), ...info, humidity: data.current.relative_humidity_2m, wind: Math.round(data.current.wind_speed_10m), _ts: Date.now() }
            setWeather(w)
            sessionStorage.setItem('annur_weather_v3', JSON.stringify(w))
          }
        }).catch(() => {})
    }
    doFetch()
    const timer = setInterval(() => { sessionStorage.removeItem('annur_weather_v3'); doFetch() }, 600000) // refresh every 10 min
    return () => clearInterval(timer)
  }, [])

  if (!weather) return null

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3.5 py-2">
      <span className="text-2xl">{weather.icon}</span>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-lg">{weather.temp}°</span>
          <span className="text-white/50 text-xs font-medium">C</span>
        </div>
        <span className="text-white/40 text-[10px] font-medium">{weather.desc}</span>
      </div>
    </div>
  )
}

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=11.23&longitude=77.02&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=Asia/Kolkata&forecast_days=3'
const REFRESH_MS = 10 * 60 * 1000 // 10 minutes

// Full weather card for homepage section
export function WeatherCard() {
  const [data, setData] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    function doFetch() {
      const cached = sessionStorage.getItem('annur_weather_full')
      if (cached) {
        try {
          const c = JSON.parse(cached)
          if (Date.now() - c._ts < REFRESH_MS) { setData(c); setLastUpdate(new Date(c._ts)); return }
        } catch {}
      }
      sessionStorage.removeItem('annur_weather_full')
      // Try backend proxy first, fallback to direct
      const fetchWeather = api.get('/proxy/weather').then(r => r.data).catch(() => fetch(WEATHER_URL).then(r => r.json()))
      fetchWeather.then(d => {
        if (!d.current) return
        const curHour = new Date().getHours()
        const info = getWmoInfo(d.current.weather_code)
        const current = { temp: Math.round(d.current.temperature_2m), feels: Math.round(d.current.apparent_temperature), humidity: d.current.relative_humidity_2m, wind: Math.round(d.current.wind_speed_10m), ...info }
        const hourly = []
        if (d.hourly) { for (let i = curHour; i < curHour + 8 && i < d.hourly.time.length; i++) { const hi = getWmoInfo(d.hourly.weather_code[i]); hourly.push({ hour: new Date(d.hourly.time[i]).getHours(), temp: Math.round(d.hourly.temperature_2m[i]), icon: hi.icon }) } }
        const daily = []
        if (d.daily) { const dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; for (let i = 0; i < Math.min(3, d.daily.time.length); i++) { const di = getWmoInfo(d.daily.weather_code[i]); const dt = new Date(d.daily.time[i]); daily.push({ day: i===0?'Today':dn[dt.getDay()], max: Math.round(d.daily.temperature_2m_max[i]), min: Math.round(d.daily.temperature_2m_min[i]), icon: di.icon, desc: di.desc, sunrise: d.daily.sunrise[i]?.slice(11,16), sunset: d.daily.sunset[i]?.slice(11,16) }) } }
        const result = { current, hourly, daily, _ts: Date.now() }
        setData(result)
        setLastUpdate(new Date())
        sessionStorage.setItem('annur_weather_full', JSON.stringify(result))
      }).catch(() => {})
    }
    doFetch()
    const timer = setInterval(() => { sessionStorage.removeItem('annur_weather_full'); doFetch() }, REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  if (!data) return null

  const { current, hourly, daily } = data

  return (
    <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden card-hover">
      {/* Main weather */}
      <div className="p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0369A1, #0EA5E9)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Annur Weather</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{current.temp}°</span>
                <span className="text-white/50 text-sm font-bold">C</span>
              </div>
              <p className="text-white/80 text-sm font-bold mt-0.5">{current.desc}</p>
              <p className="text-white/40 text-[10px]">{current.ta}</p>
            </div>
            <span className="text-5xl">{current.icon}</span>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            <div className="text-white/60 text-[11px]">
              <span className="text-white font-bold">Feels {current.feels}°</span>
            </div>
            <div className="text-white/60 text-[11px]">
              💧 <span className="text-white font-bold">{current.humidity}%</span>
            </div>
            <div className="text-white/60 text-[11px]">
              💨 <span className="text-white font-bold">{current.wind} km/h</span>
            </div>
            {lastUpdate && (
              <div className="text-white/30 text-[10px]">
                🔄 {lastUpdate.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hourly */}
      {hourly.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--c-text-muted)' }}>Next 8 Hours</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {hourly.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
                <span className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>
                  {i === 0 ? 'Now' : `${h.hour}:00`}
                </span>
                <span className="text-base">{h.icon}</span>
                <span className="text-xs font-extrabold" style={{ color: 'var(--c-text)' }}>{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-day forecast */}
      {daily.length > 0 && (
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--c-text-muted)' }}>3-Day Forecast</p>
          <div className="space-y-2">
            {daily.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold w-10" style={{ color: i === 0 ? 'var(--c-primary)' : 'var(--c-text-muted)' }}>{d.day}</span>
                <span className="text-lg">{d.icon}</span>
                <div className="flex-1 flex items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--c-text-muted)' }}>{d.min}°</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      background: 'linear-gradient(to right, #0EA5E9, #F59E0B)',
                      marginLeft: `${((d.min - 15) / 30) * 100}%`,
                      width: `${((d.max - d.min) / 30) * 100}%`,
                    }} />
                  </div>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--c-text)' }}>{d.max}°</span>
                </div>
                {d.sunrise && (
                  <span className="text-[9px] font-bold hidden sm:block" style={{ color: '#C4C0B8' }}>
                    🌅{d.sunrise} 🌇{d.sunset}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
