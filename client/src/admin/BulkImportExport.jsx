import { useState } from 'react'
import api from '../api.js'

const MODULES = [
  { key: 'services', label: 'Services', endpoint: '/services', fields: ['category','name_en','name_ta','owner','description_en','description_ta','contact','address_en','address_ta','maps_url','icon','image_url'] },
  { key: 'bus-schedules', label: 'Bus Schedules', endpoint: '/bus-schedules', fields: ['departure_time','destination_en','destination_ta','operator_type','route_info_en','route_info_ta'] },
  { key: 'contacts', label: 'Contacts', endpoint: '/contacts', fields: ['name_en','name_ta','category','phone','phone2','email','address_en','address_ta'] },
  { key: 'jobs', label: 'Jobs', endpoint: '/jobs', fields: ['title_en','title_ta','company','description_en','description_ta','deadline','contact','apply_url','know_more_url','experience'] },
  { key: 'officials', label: 'Officials', endpoint: '/officials', fields: ['name_en','name_ta','designation_en','designation_ta','contact','email','party','photo_url'] },
  { key: 'emergency-numbers', label: 'Emergency Numbers', endpoint: '/emergency-numbers', fields: ['name_en','name_ta','phone','icon','display_order'] },
]

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return { headers: [], rows: [] }
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = []
    let current = '', inQuote = false
    for (const char of lines[i]) {
      if (char === '"') { inQuote = !inQuote }
      else if (char === ',' && !inQuote) { values.push(current.trim()); current = '' }
      else { current += char }
    }
    values.push(current.trim())
    if (values.length >= headers.length) {
      const row = {}
      headers.forEach((h, j) => { row[h] = values[j] || '' })
      rows.push(row)
    }
  }
  return { headers, rows }
}

function toCSV(headers, rows) {
  const escape = v => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
}

export default function BulkImportExport() {
  const [selectedModule, setSelectedModule] = useState(MODULES[0])
  const [tab, setTab] = useState('export')
  const [csvFile, setCsvFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [exporting, setExporting] = useState(false)

  // EXPORT
  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await api.get(`${selectedModule.endpoint}/all`)
      const rows = res.data
      if (rows.length === 0) { alert('No data to export.'); setExporting(false); return }
      const headers = selectedModule.fields.filter(f => f in rows[0])
      const csv = toCSV(headers, rows)
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `annur-${selectedModule.key}-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + (err.response?.data?.error || err.message))
    }
    setExporting(false)
  }

  const handleDownloadTemplate = () => {
    const csv = selectedModule.fields.join(',') + '\n'
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template-${selectedModule.key}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // IMPORT
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result)
      setPreview(parsed)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!preview || preview.rows.length === 0) return
    setImporting(true)
    setResult(null)
    let added = 0, errors = 0, errorMsgs = []
    for (const row of preview.rows) {
      try {
        await api.post(selectedModule.endpoint, row)
        added++
      } catch (err) {
        errors++
        errorMsgs.push(`Row ${added + errors}: ${err.response?.data?.error || 'Error'}`)
      }
    }
    setResult({ added, errors, errorMsgs })
    setImporting(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Bulk Import / Export</h1>
      <p className="text-sm text-gray-400 mb-6">Upload CSV to bulk add data or export existing data as CSV.</p>

      {/* Module Selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {MODULES.map(m => (
          <button key={m.key} onClick={() => { setSelectedModule(m); setPreview(null); setCsvFile(null); setResult(null) }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedModule.key === m.key ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => { setTab('export'); setPreview(null); setResult(null) }}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'export' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>
          📤 Export
        </button>
        <button onClick={() => { setTab('import'); setResult(null) }}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'import' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>
          📥 Import
        </button>
      </div>

      {/* EXPORT TAB */}
      {tab === 'export' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-2">Export {selectedModule.label} as CSV</h3>
          <p className="text-sm text-gray-400 mb-4">Download all {selectedModule.label.toLowerCase()} data as a CSV file.</p>
          <div className="flex gap-3">
            <button onClick={handleExport} disabled={exporting}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              {exporting ? '⏳ Exporting...' : '📤 Export CSV'}
            </button>
            <button onClick={handleDownloadTemplate}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
              📄 Download Template
            </button>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fields included:</p>
            <div className="flex flex-wrap gap-1">
              {selectedModule.fields.map(f => (
                <span key={f} className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">{f}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IMPORT TAB */}
      {tab === 'import' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-2">Import {selectedModule.label} from CSV</h3>
          <p className="text-sm text-gray-400 mb-4">Upload a CSV file to bulk add {selectedModule.label.toLowerCase()}. Download the template first.</p>

          <div className="flex gap-3 mb-4">
            <button onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100">
              📄 Download Template
            </button>
          </div>

          {/* File Upload */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <span className="text-sm font-bold text-gray-500">{csvFile ? csvFile.name : 'Click to upload CSV file'}</span>
            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          </label>

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-800">Preview: {preview.rows.length} rows found</p>
                <button onClick={handleImport} disabled={importing || preview.rows.length === 0}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {importing ? `⏳ Importing... (${preview.rows.length} rows)` : `📥 Import ${preview.rows.length} rows`}
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-xl max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left text-gray-500 font-bold">#</th>
                      {preview.headers.map(h => <th key={h} className="py-2 px-3 text-left text-gray-500 font-bold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-1.5 px-3 text-gray-400">{i + 1}</td>
                        {preview.headers.map(h => <td key={h} className="py-1.5 px-3 text-gray-700 max-w-[150px] truncate">{row[h]}</td>)}
                      </tr>
                    ))}
                    {preview.rows.length > 20 && (
                      <tr><td colSpan={preview.headers.length + 1} className="py-2 px-3 text-center text-gray-400 text-xs">...and {preview.rows.length - 20} more rows</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mt-4 p-4 rounded-xl ${result.errors > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-bold text-sm">
                {result.errors === 0 ? '✅' : '⚠️'} Import Complete: <span className="text-green-700">{result.added} added</span>
                {result.errors > 0 && <>, <span className="text-red-600">{result.errors} errors</span></>}
              </p>
              {result.errorMsgs.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto text-xs text-red-600 space-y-0.5">
                  {result.errorMsgs.map((m, i) => <p key={i}>{m}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
