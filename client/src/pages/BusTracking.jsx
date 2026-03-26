import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api.js'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

// Annur center coordinates
const ANNUR = [11.2304, 77.0275]

// All route destinations with coordinates
const ROUTE_COORDS = {
  'coimbatore':       { end: [11.0168, 76.9558], via: [[11.1500, 76.9800]], color: '#3B82F6', distance: 30, emoji: '🏙️' },
  'mettupalayam':     { end: [11.2990, 76.9500], via: [[11.2650, 76.9900]], color: '#10B981', distance: 20, emoji: '🏔️' },
  'sathyamangalam':   { end: [11.5050, 77.2390], via: [[11.3500, 77.1200]], color: '#F59E0B', distance: 35, emoji: '🌳' },
  'tiruppur':         { end: [11.1085, 77.3411], via: [[11.1800, 77.1500]], color: '#8B5CF6', distance: 40, emoji: '🧵' },
  'erode':            { end: [11.3410, 77.7172], via: [[11.2500, 77.3500]], color: '#EF4444', distance: 75, emoji: '🏛️' },
  'avanashi':         { end: [11.1930, 77.0100], via: [], color: '#06B6D4', distance: 10, emoji: '🏘️' },
  'ooty':             { end: [11.4102, 76.6950], via: [[11.3000, 76.9500]], color: '#059669', distance: 50, emoji: '⛰️' },
  'mysore':           { end: [12.2958, 76.6394], via: [[11.5050, 77.2390]], color: '#7C3AED', distance: 170, emoji: '👑' },
  'salem':            { end: [11.6643, 78.1460], via: [[11.3410, 77.7172]], color: '#DC2626', distance: 150, emoji: '🏭' },
  'madurai':          { end: [9.9252, 78.1198], via: [[10.8000, 77.5000]], color: '#E11D48', distance: 210, emoji: '🛕' },
  'theni':            { end: [10.0104, 77.4760], via: [[10.5000, 77.4000]], color: '#BE185D', distance: 220, emoji: '🌄' },
  'cumbum':           { end: [9.7362, 77.2831], via: [[10.0104, 77.4760]], color: '#9D174D', distance: 260, emoji: '🍇' },
  'karur':            { end: [10.9601, 78.0766], via: [[11.1085, 77.3411]], color: '#EA580C', distance: 120, emoji: '🏗️' },
  'trichy':           { end: [10.7905, 78.7047], via: [[10.9601, 78.0766]], color: '#D97706', distance: 200, emoji: '🛕' },
  'thanjavur':        { end: [10.7870, 79.1378], via: [[10.7905, 78.7047]], color: '#CA8A04', distance: 250, emoji: '🏛️' },
  'dharapuram':       { end: [10.7363, 77.5263], via: [[11.1085, 77.3411]], color: '#65A30D', distance: 70, emoji: '🌾' },
  'dindigul':         { end: [10.3624, 77.9695], via: [[10.7363, 77.5263]], color: '#16A34A', distance: 150, emoji: '🔒' },
  'kotagiri':         { end: [11.4225, 76.8600], via: [[11.2990, 76.9500]], color: '#0D9488', distance: 45, emoji: '🌿' },
  'gudalur':          { end: [11.5028, 76.4958], via: [[11.4102, 76.6950]], color: '#0891B2', distance: 80, emoji: '🌲' },
  'coonoor':          { end: [11.3530, 76.7959], via: [[11.2990, 76.9500]], color: '#0284C7', distance: 35, emoji: '☕' },
  'karamadai':        { end: [11.2380, 76.9600], via: [], color: '#4F46E5', distance: 12, emoji: '🚂' },
  'gobichettipalayam': { end: [11.4543, 77.4400], via: [[11.5050, 77.2390]], color: '#7C3AED', distance: 55, emoji: '🌳' },
  'kovilpalayam':     { end: [11.1200, 76.9800], via: [], color: '#A855F7', distance: 15, emoji: '🏘️' },
  'palladam':         { end: [10.9920, 77.2860], via: [[11.1000, 77.1000]], color: '#C026D3', distance: 40, emoji: '🏪' },
  'udumalaipettai':   { end: [10.5880, 77.2490], via: [[10.9920, 77.2860]], color: '#DB2777', distance: 60, emoji: '🏞️' },
  'pollachi':         { end: [10.6609, 77.0089], via: [[11.0168, 76.9558]], color: '#E11D48', distance: 65, emoji: '🐘' },
  'namakkal':         { end: [11.2189, 78.1674], via: [[11.3410, 77.7172]], color: '#F97316', distance: 130, emoji: '🪨' },
  'perambalur':       { end: [11.2320, 78.8809], via: [[11.2189, 78.1674]], color: '#EF4444', distance: 230, emoji: '🏛️' },
  'bannari':          { end: [11.5900, 77.0100], via: [[11.5050, 77.2390]], color: '#84CC16', distance: 45, emoji: '⛰️' },
  'thuraiyur':        { end: [11.1468, 78.5980], via: [[10.9601, 78.0766]], color: '#22C55E', distance: 180, emoji: '🏘️' },
}

function getRouteInfo(destName) {
  const name = destName.toLowerCase()
  for (const [key, val] of Object.entries(ROUTE_COORDS)) {
    if (name.includes(key)) return { key, ...val }
  }
  return null
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.slice(0, 5).split(':').map(Number)
  return h * 60 + m
}

function getNow() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

function interpolatePosition(start, end, via, progress) {
  const points = [start, ...via, end]
  const totalSegments = points.length - 1
  const segProgress = progress * totalSegments
  const segIndex = Math.min(Math.floor(segProgress), totalSegments - 1)
  const segFrac = segProgress - segIndex
  const p1 = points[segIndex]
  const p2 = points[segIndex + 1]
  return [
    p1[0] + (p2[0] - p1[0]) * segFrac,
    p1[1] + (p2[1] - p1[1]) * segFrac,
  ]
}

function createBusIcon(color, isActive) {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);${isActive ? 'animation:busPulse 2s infinite' : 'opacity:0.5'}"><span style="font-size:14px">🚌</span></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export default function BusTracking() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const [buses, setBuses] = useState([])
  const [activeBuses, setActiveBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [currentTime, setCurrentTime] = useState(getNow())
  const [unmapped, setUnmapped] = useState(0)

  useEffect(() => {
    api.get('/bus-schedules').then(r => setBuses(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getNow()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Calculate active buses
  useEffect(() => {
    const now = currentTime
    let unmappedCount = 0
    const active = buses.map(bus => {
      const route = getRouteInfo(bus.destination_en)
      if (!route) { unmappedCount++; return null }
      const depMin = timeToMinutes(bus.departure_time)
      const travelMin = route.distance * 1.2
      const elapsed = now - depMin
      if (elapsed < -5 || elapsed > travelMin + 10) return null
      const progress = Math.max(0, Math.min(1, elapsed / travelMin))
      const position = interpolatePosition(ANNUR, route.end, route.via, progress)
      let status = 'en_route'
      if (elapsed < 0) status = 'departing_soon'
      else if (progress >= 0.95) status = 'arriving'
      return { ...bus, route, position, progress, status, depMin, elapsed }
    }).filter(Boolean)
    setActiveBuses(active)
    setUnmapped(unmappedCount)
  }, [buses, currentTime])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const map = L.map(mapRef.current, { zoomControl: false }).setView(ANNUR, 10)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Annur marker
    L.marker(ANNUR, {
      icon: L.divIcon({
        html: '<div style="background:linear-gradient(135deg,#0C4A3E,#14856A);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.3)"><span style="font-size:16px;color:white;font-weight:900">A</span></div>',
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
    }).addTo(map).bindPopup('<b>Annur Bus Stand</b><br>அன்னூர் பேருந்து நிலையம்')

    // Add destination markers
    const added = new Set()
    Object.entries(ROUTE_COORDS).forEach(([key, val]) => {
      if (added.has(key)) return
      added.add(key)
      L.circleMarker(val.end, { radius: 5, fillColor: val.color, color: 'white', weight: 2, fillOpacity: 0.8 })
        .addTo(map)
        .bindPopup(`<b>${key.charAt(0).toUpperCase() + key.slice(1)}</b><br>${val.distance} km from Annur`)
    })

    mapInstance.current = map
    return () => { map.remove(); mapInstance.current = null }
  }, [])

  // Update bus markers
  useEffect(() => {
    if (!mapInstance.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    activeBuses.forEach(bus => {
      const isActive = bus.status === 'en_route'
      const marker = L.marker(bus.position, {
        icon: createBusIcon(bus.route.color, isActive)
      }).addTo(mapInstance.current)

      const time = bus.departure_time?.slice(0, 5)
      const pct = Math.round(bus.progress * 100)
      marker.bindPopup(`
        <div style="min-width:180px">
          <b>${time} → ${bus.destination_en}</b><br>
          <span style="font-size:11px;color:#666">${bus.route_info_en || ''}</span><br>
          <span style="font-size:11px;color:#888">${bus.operator_type === 'government' ? 'Govt' : 'Private'} Bus</span><br>
          <span style="font-size:12px;color:${bus.route.color};font-weight:bold">
            ${bus.status === 'departing_soon' ? '⏳ Departing soon' : bus.status === 'arriving' ? '✅ Arriving' : `🚌 ${pct}% complete`}
          </span>
        </div>
      `)

      marker.on('click', () => setSelectedBus(bus))
      markersRef.current.push(marker)
    })
  }, [activeBuses])

  const formatTime = (min) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const nowStr = formatTime(currentTime)

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Bus Live Tracking" description="Real-time bus tracking from Annur bus stand on map" keywords="Annur bus tracking, live bus, real time, map, TNSTC" />
      <PageHeader title="Bus Live Tracking" subtitle="Real-time bus locations from Annur Bus Stand">
        <Link to="/bus-schedules" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-colors border border-white/20">
          📋 Full Schedule
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        {/* Live Status Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>LIVE</span>
            </div>
            <span className="text-lg font-extrabold tabular-nums" style={{ color: 'var(--c-primary)', fontFamily: 'var(--font-display)' }}>{nowStr}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold flex-wrap">
            <span style={{ color: 'var(--c-text-muted)' }}>🚌 {activeBuses.length} active • {buses.length} total routes • {Object.keys(ROUTE_COORDS).length} destinations mapped</span>
            <span className="flex items-center gap-1 text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full" /> En Route</span>
            <span className="flex items-center gap-1 text-amber-600"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Departing</span>
            <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Arriving</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/60 overflow-hidden shadow-sm">
            <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
          </div>

          {/* Active Bus List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide">
            <h3 className="text-sm font-extrabold sticky top-0 py-1 z-10" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)', background: 'var(--c-surface)' }}>
              Active Buses ({activeBuses.length})
            </h3>
            {activeBuses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/60">
                <div className="text-3xl mb-2">🚌</div>
                <p className="text-sm font-bold" style={{ color: 'var(--c-text-muted)' }}>No active buses right now</p>
                <p className="text-xs mt-1" style={{ color: '#C4C0B8' }}>Buses run from 01:30 to 23:00</p>
              </div>
            ) : (
              activeBuses.sort((a, b) => a.depMin - b.depMin).map((bus, i) => {
                const pct = Math.round(bus.progress * 100)
                const isSelected = selectedBus?.id === bus.id
                return (
                  <div key={`${bus.id}-${i}`}
                    onClick={() => {
                      setSelectedBus(bus)
                      mapInstance.current?.setView(bus.position, 12)
                    }}
                    className={`bg-white rounded-2xl border p-3 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-[#0C4A3E] ring-1 ring-[#0C4A3E]/20' : 'border-gray-200/60'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${bus.route.color}20` }}>
                          {bus.route.emoji || '🚌'}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold tabular-nums" style={{ color: 'var(--c-text)' }}>{bus.departure_time?.slice(0, 5)}</p>
                          <p className="text-[10px] font-bold" style={{ color: bus.route.color }}>{bus.destination_en}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                        bus.status === 'departing_soon' ? 'bg-amber-100 text-amber-800' :
                        bus.status === 'arriving' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {bus.status === 'departing_soon' ? '⏳ Soon' : bus.status === 'arriving' ? '✅ Arriving' : `🚌 ${pct}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: bus.route.color }} />
                    </div>
                    <p className="text-[9px] mt-1.5 truncate" style={{ color: 'var(--c-text-muted)' }}>
                      {bus.operator_type === 'government' ? 'Govt' : 'Pvt'} • {bus.route.distance}km • {bus.route_info_en || ''}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <p className="text-[10px] text-center mt-4" style={{ color: '#C4C0B8' }}>
          * Bus positions are estimated from scheduled departure times and average speed. {Object.keys(ROUTE_COORDS).length} destinations mapped covering {buses.length} routes.
        </p>
      </div>

      <style>{`
        @keyframes busPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
