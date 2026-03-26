import { useState, useEffect } from 'react'
import api from '../api.js'

function BarChart({ data, labelKey, valueKey, color = '#10B981', title }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1)
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-600 w-28 truncate" title={d[labelKey]}>{d[labelKey]}</span>
            <div className="flex-1 h-5 bg-gray-50 rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-1000 ease-out"
                style={{ width: `${(d[valueKey] / max) * 100}%`, background: `linear-gradient(to right, ${color}, ${color}99)` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-gray-500">{d[valueKey]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineChart({ datasets, title }) {
  // Merge all dates
  const allDates = new Set()
  datasets.forEach(ds => ds.data.forEach(d => allDates.add(d.date?.slice(0, 10))))
  const dates = [...allDates].sort()
  if (dates.length === 0) return null

  const maxVal = Math.max(...datasets.flatMap(ds => ds.data.map(d => d.count)), 1)

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="flex items-center gap-3 mb-2">
        {datasets.map(ds => (
          <span key={ds.label} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: ds.color }}>
            <span className="w-2.5 h-2.5 rounded" style={{ background: ds.color }} />
            {ds.label}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-1 h-32 border-b border-gray-100 pb-1">
        {dates.map(date => {
          const day = new Date(date).getDate()
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-0.5 group" title={date}>
              <div className="flex gap-px w-full justify-center" style={{ height: '100px' }}>
                {datasets.map(ds => {
                  const val = ds.data.find(d => d.date?.slice(0, 10) === date)?.count || 0
                  const h = maxVal > 0 ? Math.max((val / maxVal) * 100, 2) : 2
                  return (
                    <div key={ds.label} className="flex-1 flex items-end">
                      <div className="w-full rounded-t transition-all duration-700" style={{ height: `${h}%`, background: ds.color, minHeight: val > 0 ? '4px' : '1px' }} />
                    </div>
                  )
                })}
              </div>
              <span className="text-[8px] text-gray-400 font-bold">{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({ data, title }) {
  const total = data.reduce((a, d) => a + d.count, 0)
  if (total === 0) return null
  const colors = { pending: '#F59E0B', in_progress: '#3B82F6', resolved: '#10B981', rejected: '#EF4444' }
  let cumPct = 0

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map(d => {
              const pct = (d.count / total) * 100
              const offset = cumPct
              cumPct += pct
              return (
                <circle key={d.status} r="16" cx="18" cy="18" fill="none"
                  stroke={colors[d.status] || '#9CA3AF'} strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={`${-offset}`}
                  className="transition-all duration-1000"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-extrabold text-gray-800">{total}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {data.map(d => (
            <div key={d.status} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded" style={{ background: colors[d.status] || '#9CA3AF' }} />
              <span className="text-xs font-bold text-gray-600 capitalize">{d.status.replace('_', ' ')}</span>
              <span className="text-xs font-extrabold text-gray-800">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 rounded-2xl" /><div className="skeleton h-64 rounded-2xl" /></div>

  if (!data) return <p className="text-gray-400">Failed to load analytics.</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Trends, charts & insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Services by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BarChart data={data.svcByCat} labelKey="category" valueKey="count" color="#10B981" title="Services by Category (Top 15)" />
        </div>

        {/* Bus Routes by Destination */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BarChart data={data.busByDest} labelKey="destination_en" valueKey="count" color="#3B82F6" title="Bus Routes by Destination (Top 10)" />
        </div>

        {/* Growth Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:col-span-2">
          <TimelineChart
            title="Content Growth (Last 30 Days)"
            datasets={[
              { label: 'Services', data: data.recentServices, color: '#10B981' },
              { label: 'Jobs', data: data.recentJobs, color: '#8B5CF6' },
              { label: 'Articles', data: data.recentArticles, color: '#F59E0B' },
            ]}
          />
        </div>

        {/* Jobs by Company */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BarChart data={data.jobsByCompany} labelKey="company" valueKey="count" color="#8B5CF6" title="Jobs by Company (Top 10)" />
        </div>

        {/* Complaints Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          {data.complaintStats.length > 0 ? (
            <DonutChart data={data.complaintStats} title="Complaint Status" />
          ) : (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Complaint Status</h3>
              <p className="text-sm text-gray-400 py-8 text-center">No complaints yet</p>
            </div>
          )}
        </div>

        {/* Reviews Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reviews Summary</h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-amber-500">{data.reviewStats?.avg_rating ? parseFloat(data.reviewStats.avg_rating).toFixed(1) : '—'}</p>
              <p className="text-amber-500 text-lg">{'★'.repeat(Math.round(data.reviewStats?.avg_rating || 0))}{'☆'.repeat(5 - Math.round(data.reviewStats?.avg_rating || 0))}</p>
              <p className="text-xs text-gray-400 font-bold mt-1">{data.reviewStats?.total || 0} reviews</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Upcoming Events</h3>
          {data.upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingEvents.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-sm font-extrabold text-pink-700">
                    {new Date(e.event_date).getDate()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{e.title_en}</p>
                    <p className="text-[10px] text-gray-400">{new Date(e.event_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} • {e.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}
