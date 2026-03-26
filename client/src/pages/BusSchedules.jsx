import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api.js'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

export default function BusSchedules() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [buses, setBuses] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bus-schedules').then(r => setBuses(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const l = (obj, field) => lang === 'ta' && obj[`${field}_ta`] ? obj[`${field}_ta`] : obj[`${field}_en`]
  const destinations = [...new Set(buses.map(b => b.destination_en))]
  const filtered = filter === 'all' ? buses : buses.filter(b => b.destination_en === filter)

  function exportCSV() {
    const header = 'Departure,Destination,Operator,Route\n'
    const rows = filtered.map(b => `${b.departure_time?.slice(0,5)},"${l(b,'destination')}",${b.operator_type},"${l(b,'route_info') || ''}"`)
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `annur-bus-schedules-${filter}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  function handlePrint() {
    const rows = filtered.map(b => `<tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;font-family:monospace">${b.departure_time?.slice(0,5)}</td><td style="padding:6px;border:1px solid #ddd">${l(b,'destination')}</td><td style="padding:6px;border:1px solid #ddd">${b.operator_type==='government'?'Govt':'Private'}</td><td style="padding:6px;border:1px solid #ddd;font-size:12px">${l(b,'route_info')||''}</td></tr>`).join('')
    const html = `<html><head><title>Annur Bus Schedule</title></head><body style="font-family:sans-serif;padding:20px">
      <h1 style="margin:0">🚌 Annur Bus Schedule</h1>
      <p style="color:#666">அன்னூர் பேருந்து அட்டவணை • ${filter==='all'?'All Destinations':filter} • ${filtered.length} buses</p>
      <table style="width:100%;border-collapse:collapse;margin-top:15px">
        <thead><tr style="background:#0C4A3E;color:white"><th style="padding:8px;text-align:left">Time</th><th style="padding:8px;text-align:left">Destination</th><th style="padding:8px;text-align:left">Type</th><th style="padding:8px;text-align:left">Route</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#999;font-size:11px;margin-top:15px">Printed from Annur Community Portal • ${new Date().toLocaleDateString()}</p>
    </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    w.print()
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <SEO title="Bus Schedules" description="TNSTC bus timings from Annur bus stand to Coimbatore, Mettupalayam, Sathyamangalam, Tiruppur" keywords="Annur bus timing, TNSTC, bus schedule, Coimbatore bus, Mettupalayam bus" />
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-[400px] rounded-3xl mt-6" />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <PageHeader title={t('bus.title')} subtitle={t('bus.filterBy')}>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          CSV
        </button>
        <button onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
          🖨️ Print
        </button>
        <Link to="/bus-tracking" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Map
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              filter === 'all' ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'
            }`}
            style={filter === 'all' ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
            {t('bus.allDestinations')}
          </button>
          {destinations.map(dest => (
            <button key={dest} onClick={() => setFilter(dest)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                filter === dest ? 'text-white shadow-md' : 'bg-white border border-gray-200/60'
              }`}
              style={filter === dest ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
              {lang === 'ta' ? buses.find(b => b.destination_en === dest)?.destination_ta || dest : dest}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100" style={{ background: '#F8F7F4' }}>
                  <th className="py-4 px-5 text-left text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: 'var(--c-text-muted)' }}>{t('bus.departure')}</th>
                  <th className="py-4 px-5 text-left text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: 'var(--c-text-muted)' }}>{t('bus.destination')}</th>
                  <th className="py-4 px-5 text-left text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: 'var(--c-text-muted)' }}>{t('bus.operator')}</th>
                  <th className="py-4 px-5 text-left text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: 'var(--c-text-muted)' }}>{t('bus.route')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bus, idx) => (
                  <tr key={bus.id} className="border-b border-gray-50 hover:bg-[#0C4A3E]/[0.02] transition-colors" style={idx % 2 ? { background: 'rgba(0,0,0,0.01)' } : {}}>
                    <td className="py-4 px-5">
                      <span className="font-mono font-extrabold text-base tabular-nums" style={{ color: 'var(--c-text)' }}>{bus.departure_time?.slice(0, 5)}</span>
                    </td>
                    <td className="py-4 px-5 font-bold" style={{ color: 'var(--c-text)' }}>{l(bus, 'destination')}</td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        bus.operator_type === 'government'
                          ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                          : 'bg-orange-50 text-orange-700 border-orange-200/60'
                      }`}>
                        {bus.operator_type === 'government' ? t('home.government') : t('home.private')}
                      </span>
                    </td>
                    <td className="py-4 px-5" style={{ color: 'var(--c-text-muted)' }}>{l(bus, 'route_info')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">🚌</div>
              <p className="font-bold" style={{ color: 'var(--c-text-muted)' }}>{t('common.noData')}</p>
            </div>
          )}
        </div>
        <p className="text-sm mt-4 text-center font-bold" style={{ color: '#C4C0B8' }}>
          {t('bus.totalBuses')}: <span style={{ color: 'var(--c-text)' }}>{filtered.length}</span>
        </p>
      </div>
    </div>
  )
}
