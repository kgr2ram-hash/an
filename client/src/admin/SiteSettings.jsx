import { useState, useEffect } from 'react'
import api from '../api.js'

const settingKeys = [
  { key: 'site_name', label: 'Site Name' },
  { key: 'site_description', label: 'Site Description' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'contact_phone', label: 'Contact Phone' },
]

export default function SiteSettings() {
  const [settings, setSettings] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {})
  }, [])

  function updateSetting(key, lang, value) {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.put('/settings', { settings })
      setMessage('Settings saved successfully!')
    } catch {
      setMessage('Error saving settings.')
    }
    setSaving(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Settings</h1>
      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${
          message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {settingKeys.map(({ key, label }) => (
          <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label} (English)</label>
              <input
                type="text"
                value={settings[key]?.en || ''}
                onChange={e => updateSetting(key, 'en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label} (Tamil)</label>
              <input
                type="text"
                value={settings[key]?.ta || ''}
                onChange={e => updateSetting(key, 'ta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
