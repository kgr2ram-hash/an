import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

const statCards = [
  { key: 'services', label: 'Services', icon: '🏪', link: '/admin/services', color: '#10B981' },
  { key: 'categories', label: 'Categories', icon: '📂', link: '/admin/categories', color: '#0EA5E9' },
  { key: 'bus_schedules', label: 'Bus Schedules', icon: '🚌', link: '/admin/bus-schedules', color: '#3B82F6' },
  { key: 'jobs', label: 'Jobs', icon: '💼', link: '/admin/jobs', color: '#8B5CF6' },
  { key: 'articles', label: 'Articles', icon: '📰', link: '/admin/articles', color: '#F59E0B' },
  { key: 'events', label: 'Events', icon: '📅', link: '/admin/events', color: '#EC4899' },
  { key: 'officials', label: 'Officials', icon: '👤', link: '/admin/officials', color: '#6366F1' },
  { key: 'emergency_numbers', label: 'Emergency Numbers', icon: '🚨', link: '/admin/emergency-numbers', color: '#DC2626' },
  { key: 'health_care', label: 'Health Care', icon: '🏥', link: '/admin/healthcare', color: '#EF4444' },
  { key: 'healthcare_facilities', label: 'Facilities', icon: '🏨', link: '/admin/healthcare-facilities', color: '#14B8A6' },
  { key: 'contacts', label: 'Contacts', icon: '📞', link: '/admin/contacts', color: '#06B6D4' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️', link: '/admin/gallery', color: '#A855F7' },
  { key: 'blood_donors', label: 'Blood Donors', icon: '🩸', link: '/admin/blood-donors', color: '#E11D48' },
  { key: 'reviews', label: 'Reviews', icon: '⭐', link: '/admin/reviews', color: '#FBBF24' },
  { key: 'complaints', label: 'Complaints', icon: '📢', link: '/admin/complaints', color: '#F97316' },
  { key: 'service_submissions', label: 'Submissions', icon: '📋', link: '/admin/service-submissions', color: '#78716C' },
]

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const maxVal = Math.max(...Object.values(stats).map(Number).filter(Boolean), 1)
  const total = Object.values(stats).reduce((a, b) => a + (Number(b) || 0), 0)

  // Top 8 for chart
  const chartCards = [...statCards].sort((a, b) => (stats[b.key] || 0) - (stats[a.key] || 0)).slice(0, 10)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading...' : <>Total records: <span className="font-bold text-gray-600">{total.toLocaleString()}</span> across <span className="font-bold text-gray-600">{statCards.length}</span> modules</>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/analytics" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
            📈 Analytics
          </Link>
          <span className="text-xs text-gray-400 hidden sm:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Top Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Services', value: stats.services, icon: '🏪', color: '#10B981' },
          { label: 'Bus Routes', value: stats.bus_schedules, icon: '🚌', color: '#3B82F6' },
          { label: 'Categories', value: stats.categories, icon: '📂', color: '#0EA5E9' },
          { label: 'Jobs', value: stats.jobs, icon: '💼', color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <span className="text-xs font-bold text-gray-400 uppercase">{s.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-800 mt-1 tabular-nums">{s.value ?? '—'}</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '100%', background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* All Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(card => (
          <Link key={card.key} to={card.link}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1 tabular-nums">{stats[card.key] ?? '—'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ background: `${card.color}15` }}>
                {card.icon}
              </div>
            </div>
            <MiniBar value={stats[card.key] || 0} max={maxVal} color={card.color} />
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Data Overview (Top 10)</h2>
        <div className="flex items-end gap-2 h-44">
          {chartCards.map(card => {
            const val = stats[card.key] || 0
            const pct = maxVal > 0 ? Math.max((val / maxVal) * 100, 3) : 3
            return (
              <div key={card.key} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  style={{ height: `${pct}%`, background: `linear-gradient(to top, ${card.color}, ${card.color}80)`, minHeight: '6px' }}
                  title={`${card.label}: ${val}`}
                />
                <span className="text-[9px] font-bold text-gray-400 text-center leading-tight truncate w-full">{card.icon}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/admin/services', label: '+ Service', color: 'bg-green-600 hover:bg-green-700' },
            { to: '/admin/bus-schedules', label: '+ Bus Schedule', color: 'bg-blue-600 hover:bg-blue-700' },
            { to: '/admin/jobs', label: '+ Job', color: 'bg-purple-600 hover:bg-purple-700' },
            { to: '/admin/articles', label: '+ Article', color: 'bg-yellow-600 hover:bg-yellow-700' },
            { to: '/admin/events', label: '+ Event', color: 'bg-pink-600 hover:bg-pink-700' },
            { to: '/admin/emergency-numbers', label: '+ Emergency No.', color: 'bg-red-600 hover:bg-red-700' },
            { to: '/admin/officials', label: '+ Official', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { to: '/admin/contacts', label: '+ Contact', color: 'bg-cyan-600 hover:bg-cyan-700' },
            { to: '/admin/gallery', label: '+ Photo', color: 'bg-violet-600 hover:bg-violet-700' },
            { to: '/admin/blood-donors', label: '+ Blood Donor', color: 'bg-rose-600 hover:bg-rose-700' },
            { to: '/admin/healthcare-facilities', label: '+ Facility', color: 'bg-teal-600 hover:bg-teal-700' },
            { to: '/admin/categories', label: '+ Category', color: 'bg-sky-600 hover:bg-sky-700' },
          ].map(a => (
            <Link key={a.to} to={a.to} className={`px-3 py-2 ${a.color} text-white rounded-xl text-[11px] font-bold transition-colors`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Hint */}
      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/40 p-5">
        <h3 className="font-bold text-emerald-900 text-sm">Annur Community Portal</h3>
        <p className="text-xs text-emerald-700/70 mt-1">
          {stats.categories || 0} categories • {stats.services || 0} services • {stats.bus_schedules || 0} bus routes • {stats.jobs || 0} jobs • {stats.events || 0} events • {stats.contacts || 0} contacts • {stats.emergency_numbers || 0} emergency numbers
        </p>
        <div className="flex gap-2 mt-3">
          <Link to="/admin/service-submissions" className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors">
            📋 {stats.service_submissions || 0} Pending Submissions
          </Link>
          <Link to="/admin/complaints" className="text-[11px] font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-colors">
            📢 {stats.complaints || 0} Complaints
          </Link>
          <Link to="/admin/reviews" className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
            ⭐ {stats.reviews || 0} Reviews
          </Link>
        </div>
      </div>
    </div>
  )
}
