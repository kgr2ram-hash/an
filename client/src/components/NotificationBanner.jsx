import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

export default function NotificationBanner() {
  const [alerts, setAlerts] = useState([])
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dismissed_alerts') || '[]') } catch { return [] }
  })

  useEffect(() => {
    // Check for new jobs, events, articles
    const lastCheck = parseInt(localStorage.getItem('last_alert_check') || '0')
    const now = Date.now()
    if (now - lastCheck < 3600000) return // check once per hour

    Promise.all([
      api.get('/jobs').then(r => r.data.slice(0, 2)).catch(() => []),
      api.get('/events').then(r => r.data.filter(e => {
        const d = new Date(e.event_date)
        const diff = (d - new Date()) / 86400000
        return diff >= 0 && diff <= 7 // events within 7 days
      }).slice(0, 2)).catch(() => []),
    ]).then(([jobs, events]) => {
      const newAlerts = []
      jobs.forEach(j => {
        const id = `job-${j.id}`
        if (!dismissed.includes(id)) {
          newAlerts.push({ id, type: 'job', icon: '💼', title: j.title_en, sub: j.company, link: '/jobs', color: 'bg-purple-50 border-purple-200' })
        }
      })
      events.forEach(e => {
        const id = `event-${e.id}`
        if (!dismissed.includes(id)) {
          newAlerts.push({ id, type: 'event', icon: '📅', title: e.title_en, sub: new Date(e.event_date).toLocaleDateString(), link: '/events', color: 'bg-orange-50 border-orange-200' })
        }
      })
      setAlerts(newAlerts.slice(0, 3))
      localStorage.setItem('last_alert_check', String(now))
    })
  }, [])

  function dismiss(id) {
    const next = [...dismissed, id]
    setDismissed(next)
    localStorage.setItem('dismissed_alerts', JSON.stringify(next))
    setAlerts(a => a.filter(x => x.id !== id))
  }

  if (alerts.length === 0) return null

  return (
    <div className="px-4 py-2">
      <div className="max-w-6xl mx-auto space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${alert.color} animate-fade-in`}>
            <span className="text-lg">{alert.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold truncate" style={{ color: 'var(--c-text)' }}>{alert.title}</p>
              <p className="text-[10px]" style={{ color: 'var(--c-text-muted)' }}>{alert.sub}</p>
            </div>
            <Link to={alert.link} className="text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0" style={{ background: 'rgba(12,74,62,0.08)', color: 'var(--c-primary)' }}>
              View
            </Link>
            <button onClick={() => dismiss(alert.id)} className="text-gray-400 hover:text-gray-600 text-sm">&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
