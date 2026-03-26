import { useState, useEffect, useMemo } from 'react'
import api from '../api.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_BASE = API_BASE.replace('/api', '')
const PAGE_SIZE = 10

function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  useEffect(() => { setPreview(value || '') }, [value])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.onerror = () => setPreview(value || '')
      reader.readAsDataURL(file)
    } catch { setPreview(value || '') }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload', formData)
      onChange(res.data.url)
      setPreview(res.data.url)
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed.')
      setPreview(value || '')
    }
    setUploading(false)
  }

  function handleRemove() {
    onChange('')
    setPreview('')
  }

  const imgSrc = preview
    ? preview.startsWith('data:') || preview.startsWith('http')
      ? preview
      : `${SERVER_BASE}${preview}`
    : ''

  return (
    <div>
      {imgSrc ? (
        <div className="relative inline-block mb-2">
          <img src={imgSrc} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow"
          >
            &times;
          </button>
        </div>
      ) : null}
      <label className={`inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors text-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin text-green-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            <span className="text-green-700 font-medium">Uploading...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            <span className="text-gray-600 font-medium">{imgSrc ? 'Change Image' : 'Upload Image'}</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
      <p className="text-xs text-gray-400 mt-1">Max 5MB. JPG, PNG, GIF, WebP</p>
    </div>
  )
}

export default function CrudPage({ title, endpoint, columns, formFields, renderRow, filters }) {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState({})

  async function fetchItems() {
    try {
      const res = await api.get(`/${endpoint}/all`)
      setItems(res.data)
    } catch {
      const res = await api.get(`/${endpoint}`)
      setItems(res.data)
    }
  }

  useEffect(() => { fetchItems() }, [])

  // Filter items by search + active filters
  const filtered = useMemo(() => {
    let result = items

    // Apply dropdown filters
    Object.entries(activeFilters).forEach(([field, value]) => {
      if (value) result = result.filter(item => String(item[field]) === value)
    })

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        Object.values(item).some(val =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      )
    }

    return result
  }, [items, search, activeFilters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Reset to page 1 when search or filters change
  useEffect(() => { setPage(1) }, [search, activeFilters])

  function openNew() {
    setEditing(null)
    const blank = {}
    formFields.forEach(f => { blank[f.name] = f.default ?? '' })
    setForm(blank)
    setShowForm(true)
  }

  function openEdit(item) {
    setEditing(item.id)
    const data = {}
    formFields.forEach(f => {
      data[f.name] = item[f.name] ?? f.default ?? ''
    })
    setForm(data)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/${endpoint}/${editing}`, form)
      } else {
        await api.post(`/${endpoint}`, form)
      }
      setShowForm(false)
      fetchItems()
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving.')
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await api.delete(`/${endpoint}/${id}`)
      fetchItems()
    } catch {
      alert('Error deleting.')
    }
  }

  async function toggleActive(item) {
    try {
      await api.put(`/${endpoint}/${item.id}`, { ...item, is_active: !item.is_active })
      fetchItems()
    } catch {
      alert('Error updating.')
    }
  }

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function getPageNumbers() {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shrink-0"
        >
          + Add New
        </button>
      </div>

      {/* Search, Filters & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>
        {filters && filters.map(f => (
          <select
            key={f.field}
            value={activeFilters[f.field] || ''}
            onChange={e => setActiveFilters(prev => ({ ...prev, [f.field]: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">{f.label}</option>
            {f.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
        <span className="text-sm text-gray-500 shrink-0 sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {(search || Object.values(activeFilters).some(v => v)) && ` found`}
        </span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add New'} {title.replace('Manage ', '')}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'image' ? (
                    <ImageUploadField
                      value={form[field.name] || ''}
                      onChange={(url) => setField(field.name, url)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={form[field.name] || ''}
                      onChange={e => setField(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={form[field.name] || ''}
                      onChange={e => setField(field.name, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.name] || ''}
                      onChange={e => setField(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col} className="text-left py-3 px-4 font-medium text-gray-600">{col}</th>
              ))}
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                {renderRow(item)}
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paged.length === 0 && (
          <p className="text-center py-8 text-gray-400">No items found.{search ? ' Try a different search.' : ' Click "Add New" to create one.'}</p>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paged.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">
                  {item.name_en || item.title_en || item.destination_en || item.slug || '—'}
                </div>
                {(item.name_ta || item.title_ta || item.destination_ta) && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {item.name_ta || item.title_ta || item.destination_ta}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleActive(item)}
                className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {item.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
              {formFields.slice(0, 6).map(field => {
                if (field.type === 'textarea' || field.type === 'image') return null
                const val = item[field.name]
                if (!val && val !== 0) return null
                return (
                  <div key={field.name} className="min-w-0">
                    <span className="text-xs text-gray-400">{field.label}</span>
                    <div className="text-gray-700 truncate">{val}</div>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => openEdit(item)}
                className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {paged.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            No items found.{search ? ' Try a different search.' : ' Click "+ Add New" to create one.'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &laquo;
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lsaquo;
            </button>
            {getPageNumbers().map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium ${
                  p === currentPage
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &rsaquo;
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
